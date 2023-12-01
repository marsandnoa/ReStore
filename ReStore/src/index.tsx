import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/layout/App.tsx'
import '../src/app/layout/styles.css'
import '@fontsource/roboto'
import { BrowserRouter } from "react-router-dom"
import { Provider } from 'react-redux'
import { store } from './app/store/configureStore.ts'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </Provider>
  </React.StrictMode>,
)
