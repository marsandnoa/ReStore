import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/layout/App.tsx'
import '../src/app/layout/styles.css'
import '@fontsource/roboto'
import { BrowserRouter } from "react-router-dom"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
