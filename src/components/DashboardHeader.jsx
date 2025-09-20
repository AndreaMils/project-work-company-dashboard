import { useTheme } from "../hooks/useTheme";
import {
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Sun,
  Moon,
  Tractor,
  MapPin,
  Calendar,
  Thermometer,
  Droplets,
  DollarSign,
  Target,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const DashboardHeader = ({
  currentData,
  isRealTimeActive,
  onToggleRealTime,
  onRefresh,
  onReset,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTotalArea = () => {
    return Object.values(currentData.production).reduce(
      (sum, crop) => sum + crop.area,
      0
    );
  };

  const getActiveCrops = () => {
    return Object.values(currentData.production).filter(
      (crop) => crop.growthPercentage > 0
    ).length;
  };

  return (
    <header
      className={`border-b transition-all duration-300 top-0 z-50 ${
        isDarkMode
          ? "bg-gray-800/95 border-gray-700/50 backdrop-blur-lg"
          : "bg-white/95 border-gray-200/50 backdrop-blur-lg"
      } shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4 lg:py-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between space-y-6 xl:space-y-0">
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div
              className={`p-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-green-900 to-green-800"
                  : "bg-gradient-to-br from-green-100 to-green-50"
              }`}
            ></div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text dark::text-white text-gray-700">
                Azienda Agricola "Terra Verde"
              </h1>
              <div className="flex flex-col gap-6 text-sm text-gray-500 mt-4">
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-full w-fit ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <MapPin
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      isDarkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Pianura Padana, Italia
                  </span>
                </div>
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-full w-fit ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <Calendar
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      isDarkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {formatDate(currentData.timestamp)}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-full w-fit ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <span
                    className={`font-bold ${
                      isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {getTotalArea()} ha
                  </span>
                  <span
                    className={`mx-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    •
                  </span>
                  <span
                    className={`font-medium ${
                      isDarkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {getActiveCrops()} colture attive
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:gap-6">
            <div
              className={`px-5 py-3 rounded-xl flex items-center space-x-4 shadow-md transition-all duration-300 ${
                isRealTimeActive
                  ? isDarkMode
                    ? "bg-gradient-to-r from-green-900 to-green-800 border border-green-700"
                    : "bg-gradient-to-r from-green-50 to-green-100 border border-green-200"
                  : isDarkMode
                  ? "bg-gray-700 border border-gray-600"
                  : "bg-gray-100 border border-gray-200"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  isRealTimeActive
                    ? "bg-green-500 animate-pulse shadow-lg"
                    : "bg-gray-400"
                }`}
              ></div>
              <span
                className={`text-sm font-semibold ${
                  isRealTimeActive
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {isRealTimeActive ? "Live" : "Paused"}
              </span>
            </div>

            <div
              className={`flex items-center rounded-xl p-2 shadow-md gap-1 ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <button
                onClick={onToggleRealTime}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-600 hover:text-white"
                    : "text-gray-600 hover:bg-white hover:shadow-md hover:text-gray-900"
                }`}
                title={
                  isRealTimeActive
                    ? "Pausa aggiornamenti"
                    : "Riprendi aggiornamenti"
                }
              >
                {isRealTimeActive ? (
                  <Pause
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  />
                ) : (
                  <Play
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  />
                )}
              </button>

              <button
                onClick={onRefresh}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-600 hover:text-white"
                    : "text-gray-600 hover:bg-white hover:shadow-md hover:text-gray-900"
                }`}
                title="Aggiorna dati"
              >
                <RefreshCw
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
              </button>

              <button
                onClick={onReset}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-600 hover:text-white"
                    : "text-gray-600 hover:bg-white hover:shadow-md hover:text-gray-900"
                }`}
                title="Reset simulazione"
              >
                <RotateCcw
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 shadow-md ${
                isDarkMode
                  ? "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
              } hover:shadow-lg transform hover:scale-105`}
              title={isDarkMode ? "Modalità chiara" : "Modalità scura"}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Temperatura
                  </span>
                </div>
                <div className="text-lg font-bold text-red-600">
                  {currentData.environmental.temperature}°C
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Umidità
                  </span>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {currentData.environmental.humidity}%
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Ricavi Stimati
                  </span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  €{currentData.kpis.totalRevenue.toLocaleString("it-IT")}
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Efficienza Media
                  </span>
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {currentData.kpis.averageEfficiency}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </header>
  );
};

export default DashboardHeader;
