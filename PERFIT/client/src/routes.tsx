import { ThemeProvider } from 'styled-components'
import { theme } from './styles/theme'
import { GlobalStyles } from './styles/globalStyles'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


/* Routes */
import App from './App'
import Personal from './components/organisms/Personal'

export function Router() {
  return (
    <ThemeProvider theme={theme}>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />} />
            <Route path='/personal' element={<Personal />} />
          </Routes>
        </BrowserRouter>
    </ThemeProvider>
  )
}