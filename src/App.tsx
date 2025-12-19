import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import ResetPassword from "./pages/resetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Trang chủ Movie</div>} />

        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="*" element={<div>404 - Không tìm thấy trang</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
