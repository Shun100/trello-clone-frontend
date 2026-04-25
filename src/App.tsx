import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import { useSetAtom } from 'jotai'
import { currentUserAtom } from './modules/auth/current-user.state'
import { authRepository } from './modules/auth/auth.repository'
import { useEffect, useState } from 'react'

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const setCurrentUser = useSetAtom(currentUserAtom);

  useEffect(() => {
    const fetchCurrentUser = async() => {
      try {
        const user = await authRepository.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCurrentUser();
  }, []);

  if (isLoading) { return <div /> };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/' element={<Navigate to='/signin' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
