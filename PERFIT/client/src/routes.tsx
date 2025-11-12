import { ThemeProvider } from 'styled-components'
import { theme } from './styles/theme'
import { GlobalStyles } from './styles/globalStyles'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'

export function Router() {
  return (
    <ThemeProvider theme={theme}>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />} />
          </Routes>
        </BrowserRouter>
    </ThemeProvider>
  )
}