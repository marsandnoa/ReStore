import {useState } from 'react'
import Catalog from '../../features/catalog/Catalog'
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import Header from './Header'
import HomePage from '../../features/home/HomePage';
import { Navigate, Route, Routes} from 'react-router-dom';
import ProductDetails from '../../features/catalog/ProductDetails';
import AboutPage from '../../features/about/AboutPage';
import ContactPage from '../../features/contact/ContactPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ServerError from '../errors/ServerError';
import NotFound from '../errors/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? "dark" : "light";

  const theme=createTheme({
        palette:{
          mode:paletteType,
          background:{
            default: paletteType=== 'light' ? '#eaeaea': '#121212'
          }
        }
  });

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  return (
    <>
    <ThemeProvider theme={theme}>
      <ToastContainer position='bottom-right' hideProgressBar theme='colored'/>
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>

      <Container>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/catalog' element={<Catalog />} />
          <Route path='/catalog/:id' element={<ProductDetails />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/server-error' element={<ServerError />} />
          <Route path='/not-found' element={<NotFound />} />
          <Route path='*' element={<Navigate replace to='/not-found'/>} />
        </Routes>
      </Container>
    </ThemeProvider>
    </>
  )
}

export default App