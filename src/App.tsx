import { ReactFlowProvider } from '@xyflow/react';
import { PortfolioCanvas } from './components/PortfolioCanvas';

export default function App() {
  return (
    <ReactFlowProvider>
      <PortfolioCanvas />
    </ReactFlowProvider>
  );
}
