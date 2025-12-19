import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VerifyEmail from './pages/VerifyEmail';
import Login from './pages/Login';
import ResetPassword from './pages/resetPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
