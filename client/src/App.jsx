import { useState } from 'react';
import AuthForm from './components/AuthForm';
import RegisterForm from './components/RegisterForm';
import ForgotPassword from './components/ForgotPassword';

function App() {
  const [view, setView] = useState('signin'); // 'signin' | 'register'

  if (view === 'register') return <RegisterForm onSignIn={() => setView('signin')} />;
  if (view === 'forgot')   return <ForgotPassword onSignIn={() => setView('signin')} />;
  return <AuthForm
    onRegister={() => setView('register')}
    onForgot={()   => setView('forgot')}
  />;
}

export default App;
