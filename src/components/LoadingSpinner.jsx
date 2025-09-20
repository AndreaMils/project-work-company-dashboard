import { useTheme } from "../hooks/useTheme";
import { Loader2, Tractor } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const LoadingSpinner = ({ message = "Caricamento...", size = "default" }) => {
  const { isDarkMode } = useTheme();

  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      <Card className="text-center shadow-2xl glass-effect animate-slide-in-up">
        <CardContent className="space-y-6 p-8">
          <div className="flex items-center justify-center space-x-3">
            <div
              className={`p-4 rounded-xl ${
                isDarkMode ? "bg-green-900/50" : "bg-green-100/50"
              } animate-float`}
            >
              <Tractor
                className={`${sizeClasses[size]} ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                } animate-bounce`}
              />
            </div>
            <div
              className={`p-4 rounded-xl ${
                isDarkMode ? "bg-blue-900/50" : "bg-blue-100/50"
              }`}
            >
              <Loader2
                className={`${sizeClasses[size]} ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                } animate-spin`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p
              className={`text-xl font-semibold bg-gradient-to-r ${
                isDarkMode
                  ? "from-green-400 to-blue-400"
                  : "from-green-600 to-blue-600"
              } bg-clip-text text-transparent`}
            >
              {message}
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Preparazione del sistema agricolo...
            </p>
          </div>

          <div className="flex justify-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${
                isDarkMode ? "bg-green-400" : "bg-green-600"
              }`}
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${
                isDarkMode ? "bg-blue-400" : "bg-blue-600"
              }`}
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${
                isDarkMode ? "bg-purple-400" : "bg-purple-600"
              }`}
              style={{ animationDelay: "300ms" }}
            ></div>
            <div
              className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${
                isDarkMode ? "bg-yellow-400" : "bg-yellow-600"
              }`}
              style={{ animationDelay: "450ms" }}
            ></div>
          </div>

          <div
            className={`w-64 h-2 rounded-full overflow-hidden ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div
              className={`h-full bg-gradient-to-r ${
                isDarkMode
                  ? "from-green-500 to-blue-500"
                  : "from-green-600 to-blue-600"
              } animate-pulse shimmer`}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingSpinner;
