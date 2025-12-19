import { useState } from "react";

export default function ResetPassword() {
  const token = new URLSearchParams(window.location.search).get("token");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setStatus("error");
      setMessage("Token không hợp lệ.");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
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
            <p className="text-gray-700">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="mt-1 h-12 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3"
              />
            </div>
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
                className="mt-1 h-12 px-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-700">
                Hiển thị mật khẩu
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
