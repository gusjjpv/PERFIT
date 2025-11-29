import { ThemeProvider } from 'styled-components'
import { theme } from './styles/theme'
import { GlobalStyles } from './styles/globalStyles'
import { BrowserRouter } from 'react-router-dom'
import { useState } from 'react'
import { LoadingContext } from './context/LoadingContext'
import { Bounce, ToastContainer } from 'react-toastify'
import { ModalContext } from './context/ModalContext'
import { UserContext } from './context/UserContext'
import type { TokenUser } from './types'
import { AppRoutes } from './AppRoutes' 
import { SignCreateStudentContext } from './context/SignCreateStudentContext'
import { OverlayContext } from './context/OverlayContext'

export function Router() {
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ isModal, setIsModal ] = useState<boolean>(false)
  const [ user, setUser ] = useState<TokenUser | null>(null)
  const [ signStudent, setSignStudent ] = useState<boolean>(false)
  const [ isOverlay, setIsOverlay ] = useState<boolean>(false) 

  return (
    <ThemeProvider theme={theme}>
      <LoadingContext.Provider value={{ loading, setLoading }}>
        <ModalContext.Provider value={{ isModal, setIsModal}}>
          <UserContext.Provider value={{ user, setUser }}>
            <SignCreateStudentContext.Provider value={{ signStudent, setSignStudent}}>
              <OverlayContext.Provider value={{ isOverlay, setIsOverlay }}>
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
                  <AppRoutes /> 
                </BrowserRouter>
              </OverlayContext.Provider>
            </SignCreateStudentContext.Provider>
          </UserContext.Provider>
        </ModalContext.Provider>
      </LoadingContext.Provider>
    </ThemeProvider>
  )
}