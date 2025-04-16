import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/main.css'; // Importando o arquivo de estilos

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);