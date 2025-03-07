"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaPlane } from "react-icons/fa";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [debouncedEmail] = useDebounce(formData.email, 300);
  const [debouncedPhoneNumber] = useDebounce(formData.phoneNumber, 300);

  useEffect(() => {
    if (session) {
      router.replace(callbackUrl);
    }
  }, [session, callbackUrl]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return re.test(String(email).toLowerCase());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  useEffect(() => {
    if (debouncedEmail) validateField("email", debouncedEmail);
    if (debouncedPhoneNumber)
      validateField("phoneNumber", debouncedPhoneNumber);
  }, [debouncedEmail, debouncedPhoneNumber]);

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "email":
        if (!validateEmail(value)) {
          newErrors.email = "Invalid email format";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters long";
        } else {
          delete newErrors.password;
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isLogin) {
        const result = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (result?.error) {
          setErrors({ general: "Invalid username or password" });
        }
      } else {
        const result = await axios.post("/api/auth/register", formData);

        if (result.status === 201) {
          toggleAuthMode();
        } else {
          setErrors({ general: "Error during registration" });
        }
      }
    } catch (error) {
      setErrors({ general: "Unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: callbackUrl });
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
      phoneNumber: "",
    });
    setErrors({});
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-md">
        <div className="text-center">
          <FaPlane className="mx-auto h-12 w-auto text-gray-600" />
          <h2 className="mt-6 text-3xl font-semibold text-gray-900">
            {isLogin ? "Đăng nhập" : "Tạo một tài khoản mới"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md">
            {!isLogin && (
              <div className="mb-4">
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="name"
                >
                  Tên đầy đủ
                </label>
                <input
                  required
                  className="relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {!isLogin && (
              <div className="mb-4">
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="phoneNumber"
                >
                  Số điện thoại
                </label>
                <input
                  required
                  className="relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div className="mb-4">
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="email-address"
              >
                Địa chỉ email
              </label>
              <input
                required
                autoComplete="email"
                className={`relative block w-full appearance-none rounded border px-3 py-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } text-gray-900 placeholder:text-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                id="email-address"
                name="email"
                placeholder="Email address"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="relative mb-4">
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Mật khẩu
              </label>
              <input
                required
                autoComplete="current-password"
                className={`relative block w-full appearance-none rounded border px-3 py-2 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } text-gray-900 placeholder:text-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                id="password"
                name="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-sm leading-5"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>
            {!isLogin && (
              <div className="mb-4">
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="confirm-password"
                >
                  Nhập lại mật khẩu
                </label>
                <input
                  required
                  className={`relative block w-full appearance-none rounded border px-3 py-2 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } text-gray-900 placeholder:text-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  id="confirm-password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <button
              className={`group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <svg
                  className="-ml-1 mr-3 size-5 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
              ) : null}
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </button>
            {errors.general && (
              <p className="mt-2 text-center text-xs text-red-500">
                {errors.general}
              </p>
            )}
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              className="inline-flex w-64 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 motion-safe:hover:scale-105"
              onClick={handleGoogleSignIn}
            >
              <svg
                height="20"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                    fill="#34A853"
                  />
                  <path
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                    fill="#EA4335"
                  />
                </g>
              </svg>
              <span className="ml-2">Google</span>
            </button>
          </div>
        </div>

        <div className="text-center text-sm">
          <button
            className="font-medium text-indigo-600 hover:text-indigo-500"
            onClick={toggleAuthMode}
          >
            {isLogin
              ? "Chưa có tài khoản? Đăng ký"
              : "Đã có tài khoản? Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
