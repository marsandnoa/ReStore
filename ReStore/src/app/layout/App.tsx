import { useCallback, useEffect, useState } from 'react'
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
import BasketPage from '../../features/basket/BasketPage';
import agent from '../api/agent';
import { getCookie } from '../util/util';
import LoadingComponent from './LoadingComponent';
import CheckoutPage from '../../features/checkout/CheckoutPage';
import { useAppDispatch } from '../store/configureStore';
import { fetchBasketAsync, setBasket } from '../../features/basket/basketSlice';
import Login from '../../features/account/Login';
import Register from '../../features/account/Register';
import { fetchCurrentUser } from '../../features/account/accountSlice';

function App() {
  const dispatch=useAppDispatch();
  const [loading,setLoading]=useState(true);


  const initApp=useCallback(async()=>{
    try{
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());

    }catch(error:any){
      console.log(error);
    }

  },[dispatch]);
  
  useEffect(()=>{
    initApp().then(()=>setLoading(false));
  },[initApp])

  const [darkMode, setDarkMode] = useState(true);
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

  if(loading) return <LoadingComponent message="Initializing"/>

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
          <Route path='/basket' element={<BasketPage/>} />
          <Route path='/checkout' element={<CheckoutPage/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
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