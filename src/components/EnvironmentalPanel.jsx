import { useTheme } from "../hooks/useTheme";
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Gauge,
  CloudRain,
  Eye,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardTitle } from "./ui/card";

const EnvironmentalPanel = ({
  currentData,
  trends,
  expanded = false,
  className = "",
}) => {
  const { isDarkMode } = useTheme();

  const environmentalMetrics = [
    {
      id: "temperature",
      title: "Temperatura",
      value: currentData.temperature,
      unit: "°C",
      icon: Thermometer,
      color: getTemperatureColor(currentData.temperature),
      range: { min: -10, max: 45, optimal: { min: 15, max: 25 } },
      description: expanded ? "Temperatura dell'aria esterna" : null,
    },
    {
      id: "humidity",
      title: "Umidità",
      value: currentData.humidity,
      unit: "%",
      icon: Droplets,
      color: getHumidityColor(currentData.humidity),
      range: { min: 0, max: 100, optimal: { min: 60, max: 80 } },
      description: expanded ? "Umidità relativa dell'aria" : null,
    },
    {
      id: "rainfall",
      title: "Precipitazioni",
      value: currentData.rainfall,
      unit: "mm",
      icon: CloudRain,
      color: getRainfallColor(currentData.rainfall),
      range: { min: 0, max: 50, optimal: { min: 2, max: 10 } },
      description: expanded ? "Precipitazioni nelle ultime ore" : null,
    },
    {
      id: "windSpeed",
      title: "Vento",
      value: currentData.windSpeed,
      unit: "km/h",
      icon: Wind,
      color: getWindColor(currentData.windSpeed),
      range: { min: 0, max: 50, optimal: { min: 5, max: 15 } },
      description: expanded ? "Velocità del vento" : null,
    },
    {
      id: "uvIndex",
      title: "Indice UV",
      value: currentData.uvIndex,
      unit: "",
      icon: Sun,
      color: getUVColor(currentData.uvIndex),
      range: { min: 0, max: 11, optimal: { min: 3, max: 6 } },
      description: expanded ? "Intensità dei raggi ultravioletti" : null,
    },
    {
      id: "soilMoisture",
      title: "Umidità Suolo",
      value: currentData.soilMoisture,
      unit: "%",
      icon: Gauge,
      color: getSoilMoistureColor(currentData.soilMoisture),
      range: { min: 0, max: 100, optimal: { min: 40, max: 70 } },
      description: expanded ? "Umidità del terreno agricolo" : null,
    },
  ];

  function getTemperatureColor(temp) {
    if (temp < 5) return "blue";
    if (temp < 15) return "cyan";
    if (temp < 25) return "green";
    if (temp < 30) return "yellow";
    return "red";
  }

  function getHumidityColor(humidity) {
    if (humidity < 40) return "red";
    if (humidity < 60) return "yellow";
    if (humidity < 80) return "green";
    return "blue";
  }

  function getRainfallColor(rainfall) {
    if (rainfall === 0) return "gray";
    if (rainfall < 5) return "blue";
    if (rainfall < 15) return "green";
    return "red";
  }

  function getWindColor(wind) {
    if (wind < 10) return "green";
    if (wind < 20) return "yellow";
    return "red";
  }

  function getUVColor(uv) {
    if (uv < 3) return "green";
    if (uv < 6) return "yellow";
    if (uv < 8) return "orange";
    return "red";
  }

  function getSoilMoistureColor(moisture) {
    if (moisture < 30) return "red";
    if (moisture < 50) return "yellow";
    if (moisture < 80) return "green";
    return "blue";
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: isDarkMode
        ? "text-blue-400 bg-blue-900"
        : "text-blue-600 bg-blue-50",
      cyan: isDarkMode
        ? "text-cyan-400 bg-cyan-900"
        : "text-cyan-600 bg-cyan-50",
      green: isDarkMode
        ? "text-green-400 bg-green-900"
        : "text-green-600 bg-green-50",
      yellow: isDarkMode
        ? "text-yellow-400 bg-yellow-900"
        : "text-yellow-600 bg-yellow-50",
      orange: isDarkMode
        ? "text-orange-400 bg-orange-900"
        : "text-orange-600 bg-orange-50",
      red: isDarkMode ? "text-red-400 bg-red-900" : "text-red-600 bg-red-50",
      gray: isDarkMode
        ? "text-gray-400 bg-gray-700"
        : "text-gray-600 bg-gray-50",
    };
    return colors[color] || colors.gray;
  };

  const formatChartData = () => {
    return trends.map((point) => ({
      time: format(new Date(point.timestamp), "HH:mm"),
      temperature: point.temperature,
      humidity: point.humidity,
      rainfall: point.rainfall,
      windSpeed: point.windSpeed,
      uvIndex: point.uvIndex,
      soilMoisture: point.soilMoisture,
    }));
  };

  const isOptimalRange = (value, range) => {
    return value >= range.optimal.min && value <= range.optimal.max;
  };

  const getStatusIcon = (metric) => {
    const isOptimal = isOptimalRange(metric.value, metric.range);
    return isOptimal ? (
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    ) : (
      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
    );
  };

  return (
    <div className={`space-y-8 ${className} mx-0 lg:mx-0`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Eye
            className={`w-7 h-7 ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <h2 className="text-2xl font-bold">Condizioni Ambientali</h2>
        </div>
        <div className="text-sm text-gray-500">
          Aggiornato: {format(new Date(currentData.timestamp), "HH:mm:ss")}
        </div>
      </div>

      <div
        className={`grid grid-cols-2 ${
          expanded ? "lg:grid-cols-3" : "lg:grid-cols-2"
        } gap-8 mt-6`}
      >
        {environmentalMetrics.map((metric) => {
          const IconComponent = metric.icon;
          const colorClasses = getColorClasses(metric.color);

          return (
            <Card
              key={metric.id}
              className="transition-all duration-200 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg ${colorClasses.split(" ")[1]}`}
                  >
                    <IconComponent
                      className={`w-6 h-6 ${colorClasses.split(" ")[0]}`}
                    />
                  </div>
                  {getStatusIcon(metric)}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                    {metric.title}
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      colorClasses.split(" ")[0]
                    } leading-tight`}
                  >
                    {metric.value.toFixed(1)}
                    {metric.unit}
                  </p>

                  {expanded && metric.description && (
                    <p className="text-xs text-gray-400 mt-3">
                      {metric.description}
                    </p>
                  )}

                  {expanded && (
                    <div className="text-xs text-gray-500 mt-2">
                      Ottimale: {metric.range.optimal.min}-
                      {metric.range.optimal.max}
                      {metric.unit}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {(expanded || trends.length > 5) && (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <CardTitle className="text-xl font-semibold flex items-center space-x-3">
                <TrendingUp className="w-6 h-6" />
                <span>Trend Ambientali</span>
              </CardTitle>
              <div className="text-sm text-gray-500">
                Ultimi {trends.length} aggiornamenti
              </div>
            </div>

            <div className="chart-16x9">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatChartData()}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="time"
                    stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                    fontSize={12}
                  />
                  <YAxis
                    stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                      border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: isDarkMode ? "#f3f4f6" : "#111827" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Temperatura (°C)"
                    dot={{ fill: "#ef4444", strokeWidth: 0, r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Umidità (%)"
                    dot={{ fill: "#3b82f6", strokeWidth: 0, r: 3 }}
                  />
                  {expanded && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="windSpeed"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Vento (km/h)"
                        dot={{ fill: "#10b981", strokeWidth: 0, r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="soilMoisture"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        name="Umidità Suolo (%)"
                        dot={{ fill: "#f59e0b", strokeWidth: 0, r: 3 }}
                      />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {expanded && (
        <div className="space-y-2">
          {environmentalMetrics
            .filter((metric) => !isOptimalRange(metric.value, metric.range))
            .map((metric) => (
              <div
                key={`alert-${metric.id}`}
                className={`p-3 rounded-lg border-l-4 ${
                  isDarkMode
                    ? "bg-yellow-900 border-yellow-500 text-yellow-300"
                    : "bg-yellow-50 border-yellow-500 text-yellow-800"
                }`}
              >
                <p className="text-sm">
                  <strong>{metric.title}</strong> fuori dal range ottimale:
                  {metric.value.toFixed(1)}
                  {metric.unit}
                  (ottimale: {metric.range.optimal.min}-
                  {metric.range.optimal.max}
                  {metric.unit})
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default EnvironmentalPanel;
