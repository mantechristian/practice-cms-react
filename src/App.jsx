import { useLayoutEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import './App.css';
import Dashboard from "./components/Dashboard";
import Header from './components/Header';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { ContactsProvider } from './contexts/ContactsContext';
import './scss/main.scss';
import { decodeAccessToken } from './utils';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useLayoutEffect(() => {
    try {
      const accessToken = localStorage.getItem('accessToken')?.toString();
      const decoded = decodeAccessToken(accessToken);
      const date = new Date(decoded.exp * 1000);
      const isExpired = date.getTime() < Date.now();
      setIsAuthenticated(!isExpired);
    } catch (error) {
      console.log('error', error);
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/dashboard" element={isAuthenticated ? <ContactsProvider><Dashboard /></ContactsProvider> : <SignIn setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
    </>
  )
}

export default App;