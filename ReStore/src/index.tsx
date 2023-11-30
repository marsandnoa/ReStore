import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/layout/App.tsx'
import '../src/app/layout/styles.css'
import '@fontsource/roboto'
import { BrowserRouter } from "react-router-dom"
import { StoreProvider } from './app/context/StoreContext.tsx'
import { configureStore } from './app/store/configureStore.ts'
import { Provider } from 'react-redux'

const store=configureStore();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </Provider>
    </StoreProvider>
  </React.StrictMode>,
)
