import { useState } from "react";

export default function ResetPassword() {
  const token = new URLSearchParams(window.location.search).get("token");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- LOGIC VALIDATION MỚI ---
  const isPasswordLengthValid = password.length >= 6;
  const isPasswordMatch = password === confirmPassword;
  
  // Chỉ hiện lỗi khi người dùng đã bắt đầu nhập liệu
  const showLengthError = password.length > 0 && !isPasswordLengthValid;
  const showMatchError = confirmPassword.length > 0 && !isPasswordMatch;

  // Điều kiện để nút Submit sáng lên
  const isValidToSubmit = isPasswordLengthValid && isPasswordMatch && token;
  // -----------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check lại lần cuối cho chắc chắn
    if (!token) {
      setStatus("error");
      setMessage("Token không hợp lệ.");
      return;
    }
    if (!isValidToSubmit) {
       return; // Chặn nếu cố tình bấm enter
    }

    try {
      setStatus("loading");

      const res = await fetch(`${apiUrl}/auth/reset-password?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Đặt lại mật khẩu thành công!");
      } else {
        setStatus("error");
        setMessage(data.message || "Đặt lại mật khẩu thất bại.");
      }
    } catch {
      setStatus("error");
      setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-300">
      <div className="p-6 bg-white rounded-xl shadow-xl w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-center">🔐 Đặt lại mật khẩu</h2>

        {status === "success" || status === "error" ? (
          <div className="text-center space-y-2">
            <div className="text-5xl">
              {status === "success" ? "✅" : "❌"}
            </div>
            <p className={`text-lg font-medium ${status === "success" ? "text-green-600" : "text-red-600"}`}>
                {message}
            </p>
             {/* Nút quay về trang login nếu thành công (Optional) */}
             {status === "success" && (
                 <a href="/login" className="inline-block mt-4 text-indigo-600 hover:underline">Quay về đăng nhập</a>
             )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Mật khẩu mới */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Tối thiểu 6 ký tự"
                className={`mt-1 h-12 block w-full border rounded-md shadow-sm sm:text-sm px-3 focus:outline-none focus:ring-2
                    ${showLengthError 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                    }`}
              />
              {showLengthError && (
                  <p className="text-red-500 text-xs mt-1">Mật khẩu phải có ít nhất 6 ký tự.</p>
              )}
            </div>

            {/* Input Xác nhận mật khẩu */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`mt-1 h-12 px-3 block w-full border rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2
                    ${showMatchError 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                    }`}
              />
               {showMatchError && (
                  <p className="text-red-500 text-xs mt-1">Mật khẩu xác nhận không khớp.</p>
              )}
            </div>

            {/* Checkbox hiện mật khẩu */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-700 cursor-pointer select-none">
                Hiển thị mật khẩu
              </label>
            </div>

            {/* Nút Submit đã được chỉnh sửa */}
            <button
              type="submit"
              disabled={status === "loading" || !isValidToSubmit}
              className={`w-full py-2 px-4 rounded-md focus:outline-none transition-all duration-200
                ${
                  status === "loading" || !isValidToSubmit
                    ? "bg-gray-400 cursor-not-allowed opacity-70" // Style khi bị disable
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5" // Style khi active
                }
              `}
            >
              {status === "loading" ? (
                  <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                  </span>
              ) : (
                  "Đặt lại mật khẩu"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}