import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Product } from '../models/product'
import Catalog from '../../features/catalog/Catalog'
import { Container, CssBaseline, ThemeProvider, Typography, createTheme } from '@mui/material'
import Header from './Header'



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
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
      <Container>
        <Catalog />
      </Container>
    </ThemeProvider>
    </>
  )
}

export default App
