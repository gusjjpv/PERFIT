import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import App from './App';
import Personal from './components/organisms/Personal';
import { UserContext } from './context/UserContext';
import { cleanLocalStorage, getAccessTokenInLocalStorage, getRefreshTokenInLocalStorage, getUserDataInLocaStorage } from './storage/LocalStorage';
import Student from './components/organisms/Student';
import { refreshAccessToken } from './auth/auth';
import { setupFetchInterceptor } from './auth/fetchUser';
import Aluno from './components/organisms/Aluno';
import ErrorPage from './components/organisms/ErrorPage';

export function AppRoutes() {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const accessToken = getAccessTokenInLocalStorage()
    const refreshToken = getRefreshTokenInLocalStorage()
    const userData = getUserDataInLocaStorage()
    

    if(accessToken && refreshToken && userData) {
      setUser({
        access: accessToken,
        refresh: refreshToken,
        first_name: userData.first_name,
        role: userData.role,
        detail: userData.detail,
        user_id: userData.user_id,
        username: userData.username
      })
    }

    //console.log(user)

  }, [setUser])


  useEffect(() => {
    const privateRoutes = ['/personal', '/aluno', '/aluno-info'];
    const isPrivateRoute = privateRoutes.some(route => location.pathname.startsWith(route));

    if (user && isPrivateRoute) {
      const isAlunoInfoPath = location.pathname.startsWith('/aluno-info/');
      
      if (user.role === 'professor') {
        if (location.pathname !== '/personal' && !isAlunoInfoPath) {
          navigate("/personal", { replace: true });
          return;
        }
      } 
      
      else if (user.role === 'aluno') {
        if (location.pathname !== '/aluno' && !isAlunoInfoPath) {
          navigate("/aluno", { replace: true });
          return;
        }
      }
      
      // Se o usuário estiver logado, mas com um papel não mapeado
      else {
        navigate("/", { replace: true });
        return;
      }
    }
  }, [location.pathname, navigate, user])

  useEffect(() => {
    refreshAccessToken(setUser)
  }, [setUser])

  useEffect(() => {
    setupFetchInterceptor(setUser);
  }, [setUser]);

  // Atualiza o token a cada 2 minutos
  useEffect(() => {
    const intervalId = setInterval(() => {
     const update = async () => {
      const response = await refreshAccessToken(setUser)
      if (!response) {
        setUser(null)
        cleanLocalStorage()
        navigate('/')
      }
    }

    update()

    }, 1 * 60 * 1000)
  
    return () => clearInterval(intervalId)
  }, [])

  //cleanLocalStorage()

  return (
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/personal' element={user?.role === 'professor' ? <Personal /> : <App />} />
      <Route path='/aluno' element={user?.role === 'aluno' ? <Aluno /> : <App />} />
      {/* <Route path='/aluno' element={ <Aluno /> } /> */}
      <Route 
          path='/aluno-info/:id'
          element={user?.role === 'professor' || user?.role === 'aluno' ? <Student /> : null} 
      />

      {/* Rota para qualquer rota inexistente */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}