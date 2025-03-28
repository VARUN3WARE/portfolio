from flask import Flask, jsonify, request
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import os
from langchain_groq import ChatGroq

# Initialize Flask
app = Flask(__name__)

def initialize_llm():
    llm = ChatGroq(
        temperature=0,
        groq_api_key="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",
        model_name="llama-3.3-70b-versatile"
    )
    return llm

# Main endpoint for asking questions
@app.route('/ask', methods=['POST'])
def ask():
    user_query = request.json.get('query')  # Get the query from the request
    if not user_query:
        return jsonify({'error': 'No query provided'}), 400

    llm = initialize_llm()
    db_path = "./chroma_db"

    if not os.path.exists(db_path):
        vector_db = create_vector_db()
    else:
        embeddings = HuggingFaceBgeEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
        vector_db = Chroma(persist_directory=db_path, embedding_function=embeddings)
    
    qa_chain = setup_qa_chain(vector_db, llm)
    
    response = qa_chain.run(user_query)  # Get the response from the chatbot
    return jsonify({'response': response})

# This makes the app compatible with Netlify Functions
def handler(event, context):
    return app(event, context)
