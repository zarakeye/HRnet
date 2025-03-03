import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './app/App'
import Container from './components/Container'
import Header from './components/Header'

const rootElement =document.getElementById('root')

if (!rootElement) {
  throw new Error("Failed to find the root element in the HTML. Ensure you have a <div id='root'></div> in your index.html file.");
}
const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <Container>
      <Router>
        <Header />
        <App />
      </Router>
    </Container>
  </React.StrictMode>,
)
