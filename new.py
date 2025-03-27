from flask import Flask, request, jsonify
from flask_cors import CORS  # To handle CORS
from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from langchain_groq import ChatGroq

# Initialize the Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Function to initialize the LLM
def initialize_llm():
    llm = ChatGroq(
        temperature=0,
        groq_api_key="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",
        model_name="llama-3.3-70b-versatile"
    )
    return llm

# Function to create the vector database
def create_vector_db():
    loader = DirectoryLoader("data", glob='*.pdf', loader_cls=PyPDFLoader)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_documents(documents)
    embeddings = HuggingFaceBgeEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
    vector_db = Chroma.from_documents(texts, embeddings, persist_directory='./chroma_db')
    vector_db.persist()
    return vector_db

# Function to set up the QA chain
def setup_qa_chain(vector_db, llm):
    retriever = vector_db.as_retriever()
    prompt_template = """ 
    You are a helpful assistant. Answer the following query by providing the most relevant information.
    If the answer is not found in the provided context, say "Sorry, I don't have enough information."
    {context}
    User: {question}
    Chatbot: """
    
    PROMPT = PromptTemplate(template=prompt_template, input_variables=['context', 'question'])
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={"prompt": PROMPT}
    )
    return qa_chain

# Define the route to handle user queries
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

if __name__ == "__main__":
    app.run(debug=True)
