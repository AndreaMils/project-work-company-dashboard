import { useTheme } from "../hooks/useTheme";
import {
  Wheat,
  TrendingUp,
  Target,
  DollarSign,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const ProductionPanel = ({
  productionData,
  trends,
  selectedCrop = "all",
  expanded = false,
  className = "",
}) => {
  const { isDarkMode } = useTheme();

  const cropIcons = {
    wheat: "🌾",
    corn: "🌽",
    tomatoes: "🍅",
    olives: "🫒",
  };

  const cropColors = {
    wheat: "#f59e0b",
    corn: "#eab308",
    tomatoes: "#ef4444",
    olives: "#22c55e",
  };

  const cropsArray = Object.entries(productionData).map(([key, data]) => ({
    id: key,
    ...data,
    icon: cropIcons[key] || "🌱",
    color: cropColors[key] || "#6b7280",
  }));

  const displayCrops =
    selectedCrop === "all"
      ? cropsArray
      : cropsArray.filter((crop) => crop.id === selectedCrop);

  const efficiencyData = displayCrops.map((crop) => ({
    name: crop.name,
    efficiency: crop.efficiency,
    growth: crop.growthPercentage,
    fill: crop.color,
  }));

  const productionPieData = cropsArray.map((crop) => ({
    name: crop.name,
    value: crop.currentProduction,
    fill: crop.color,
  }));

  const revenuePieData = cropsArray.map((crop) => ({
    name: crop.name,
    value: crop.estimatedRevenue,
    fill: crop.color,
  }));

  const getStatusColor = (efficiency) => {
    if (efficiency >= 90) return "green";
    if (efficiency >= 75) return "yellow";
    if (efficiency >= 60) return "orange";
    return "red";
  };

  const getStatusIcon = (efficiency) => {
    if (efficiency >= 75) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  };

  const getGrowthStage = (percentage) => {
    if (percentage < 25) return { stage: "Piantagione", color: "blue" };
    if (percentage < 50) return { stage: "Crescita", color: "green" };
    if (percentage < 75) return { stage: "Fioritura", color: "yellow" };
    if (percentage < 95) return { stage: "Maturazione", color: "orange" };
    return { stage: "Raccolta", color: "red" };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-lg border shadow-lg ${
            isDarkMode
              ? "bg-gray-800 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}
              {entry.name.includes("Efficienza")
                ? "%"
                : entry.name.includes("Crescita")
                ? "%"
                : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-8 ${className} mx-0 lg:mx-0`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Wheat
            className={`w-7 h-7 ${
              isDarkMode ? "text-green-400" : "text-green-600"
            }`}
          />
          <h2 className="text-2xl font-bold">
            {selectedCrop === "all"
              ? "Produzione Generale"
              : `${productionData[selectedCrop]?.name || "Coltura"}`}
          </h2>
        </div>
        <div className="text-sm text-gray-500">
          {displayCrops.length} coltur{displayCrops.length === 1 ? "a" : "e"}{" "}
          monitorate
        </div>
      </div>

      <div
        className={`grid grid-cols-1 ${
          expanded ? "lg:grid-cols-2" : "md:grid-cols-2"
        } gap-10 mt-6`}
      >
        {displayCrops.map((crop) => {
          const growthStage = getGrowthStage(crop.growthPercentage);

          return (
            <Card
              key={crop.id}
              className="transition-all duration-200 hover:shadow-lg"
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{crop.icon}</span>
                    <div>
                      <h3 className="font-semibold text-xl">{crop.name}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{crop.area} ha</span>
                      </div>
                    </div>
                  </div>
                  {getStatusIcon(crop.efficiency)}
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-gray-500">Crescita</span>
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {crop.growthPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div
                    className={`w-full bg-gray-200 rounded-full h-2.5 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        isDarkMode ? "bg-green-500" : "bg-green-600"
                      }`}
                      style={{ width: `${crop.growthPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        growthStage.color === "blue"
                          ? "bg-blue-100 text-blue-800"
                          : growthStage.color === "green"
                          ? "bg-green-100 text-green-800"
                          : growthStage.color === "yellow"
                          ? "bg-yellow-100 text-yellow-800"
                          : growthStage.color === "orange"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {growthStage.stage}
                    </span>
                    <span className="text-gray-500">{crop.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-gray-500">Efficienza</span>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        getStatusColor(crop.efficiency) === "green"
                          ? "text-green-600"
                          : getStatusColor(crop.efficiency) === "yellow"
                          ? "text-yellow-600"
                          : getStatusColor(crop.efficiency) === "orange"
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {crop.efficiency}%
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-500">Produzione</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      {crop.currentProduction.toFixed(1)}t
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <DollarSign className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-gray-500">Ricavi</span>
                    </div>
                    <p className="text-lg font-bold text-yellow-600">
                      €{crop.estimatedRevenue.toLocaleString("it-IT")}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="text-xs text-gray-500">€/ha</span>
                    </div>
                    <p className="text-lg font-bold text-purple-600">
                      {Math.round(crop.estimatedRevenue / crop.area)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedCrop === "all" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-8">
              <CardTitle className="text-xl font-semibold mb-6">
                Efficienza per Coltura
              </CardTitle>
              <div className="chart-16x9">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={efficiencyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                    />
                    <XAxis
                      dataKey="name"
                      stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                      fontSize={12}
                    />
                    <YAxis
                      stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="efficiency"
                      name="Efficienza"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <CardTitle className="text-xl font-semibold mb-6">
                Distribuzione Ricavi
              </CardTitle>
              <div className="chart-16x9">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenuePieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {revenuePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `€${value.toLocaleString("it-IT")}`,
                        "Ricavi",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCrop !== "all" && trends && trends.length > 0 && expanded && (
        <Card>
          <CardContent className="p-6">
            <CardTitle className="text-lg font-semibold mb-4">
              Trend Crescita - {productionData[selectedCrop]?.name}
            </CardTitle>
            <div className="chart-16x9">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends.slice(-10)}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="date"
                    stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                    fontSize={12}
                  />
                  <YAxis
                    stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="growthPercentage"
                    name="Crescita"
                    fill={cropColors[selectedCrop]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductionPanel;
