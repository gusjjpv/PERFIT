import { ThemeProvider } from 'styled-components'
import { theme } from './styles/theme'
import { GlobalStyles } from './styles/globalStyles'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import { LoadingContext } from './context/LoadingContext'


/* Routes */
import App from './App'
import Personal from './components/organisms/Personal'
import StudentInfo from './components/organisms/Student'
import { Bounce, ToastContainer } from 'react-toastify'

export function Router() {
  const [ loading, setLoading ] = useState<boolean>(true)

  return (
    <ThemeProvider theme={theme}>
      <LoadingContext.Provider value={{ loading, setLoading }}>
        <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="light"
          transition={Bounce}
        />
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />} />
            <Route path='/personal' element={<Personal />} />
            <Route path='/personal/studentInfo' element={<StudentInfo />} />
          </Routes>
        </BrowserRouter>
      </LoadingContext.Provider>
    </ThemeProvider>
  )
}