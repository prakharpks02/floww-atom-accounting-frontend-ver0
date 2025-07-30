import { useContext, useState } from "react";
import { User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { showToast } from "../../utils/showToast";
import { ToastContainer } from "react-toastify";

export const MemberLogin = ({ onMemberLogin, onBack, loginMember }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showToast("Please enter both username and password", 1);
      return;
    }
    loginMember(username, password, setIsLoading);
  };

  return (
    <>
      <ToastContainer />
      <div className="login-card w-full relative">
        <button
          onClick={onBack}
          className="absolute top-4 left-0 cursor-pointer p-2 rounded-full hover:bg-violet-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex flex-col items-center space-y-2 mb-6 mt-2">
          <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center">
            <User className="w-8 h-8 text-violet-600" />
          </div>
          <h2 className="md:text-2xl text-xl font-medium text-gray-800">
            Member Login
          </h2>
          <p className="text-sm text-gray-500">
            Sign in with your member credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              disabled={isLoading}
              className="w-full mt-1 h-12 px-4 rounded-xl text-gray-800 border border-gray-300 focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
                disabled={isLoading}
                className="w-full mt-1 h-12 px-4 pr-12 text-gray-800 rounded-xl border border-gray-300 focus:border-violet-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-violet-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full h-12 rounded-xl cursor-pointer font-semibold text-white bg-gradient-to-r from-violet-500 to-violet-400 hover:from-violet-600 hover:to-violet-500 disabled:opacity-50 transition"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            className="text-sm text-violet-600 hover:underline underline-offset-6 cursor-pointer transition"
            type="button"
          >
            Forgot your password?
          </button>
        </div>
      </div>
    </>
  );
};
