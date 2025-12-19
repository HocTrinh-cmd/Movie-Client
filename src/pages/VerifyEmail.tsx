import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Đang xác minh tài khoản...");
  const apiUrl = import.meta.env.VITE_API_URL;
  
  console.log("API URL:", apiUrl);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setStatus("error");
      setMessage("Không tìm thấy token xác minh.");
      return;
    }

    fetch(`${apiUrl}/auth/verify-email?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setStatus("success");
          setMessage(data.message || "Xác minh thành công!");
        } else {
          setStatus("error");
          setMessage(data.message || "Xác minh thất bại.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Xác minh thất bại. Vui lòng thử lại sau.");
      });
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-300">
      <div className="text-center p-6 bg-white rounded-xl shadow-xl max-w-md w-full space-y-4">
        <div className="text-5xl">
          {status === "loading" && "⏳"}
          {status === "success" && "✅"}
          {status === "error" && "❌"}
        </div>
        <h2 className="text-2xl font-semibold">
          {status === "success"
            ? "Xác minh thành công"
            : status === "error"
            ? "Xác minh thất bại"
            : "Đang xác minh..."}
        </h2>
        <p className="text-gray-700 text-lg">{message}</p>
      </div>
    </div>
  );
}
