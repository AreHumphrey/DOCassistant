import React, { useContext, ReactNode, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../stores/store';
import { login, logout } from '@/stores/authSlice';
import { AuthContextProps } from "@/types/Auth/AuthProvider"
import { useNavigate } from 'react-router-dom';

const AuthContext = React.createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const savedToken = localStorage.getItem('token'); // Проверяем localStorage или куки
    if (savedToken) {
      dispatch(login({ token: savedToken })); // Устанавливаем токен в Redux
    }

    setIsInitializing(false); // Завершаем инициализацию
  }, [dispatch]);

  const loginHandler = (token: string) => {
    dispatch(login({ token }));
    localStorage.setItem('token', token);
  };

  const logoutHandler = () => {
    dispatch(logout());
    localStorage.removeItem('token'); // Удаляем токен из localStorage
  };

  const requireAuth = () => {
    if (!authState.isAuthenticated) {
      navigate('/login'); // Перенаправляем на страницу входа, если пользователь не авторизован
    }
  };

  const contextValue: AuthContextProps = {
    isAuthenticated: authState.isAuthenticated,
    token: authState.token,
    login: loginHandler,
    logout: logoutHandler,
    requireAuth: requireAuth
  };

  if (isInitializing) {
    return (
      <>
      </>
    )
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
