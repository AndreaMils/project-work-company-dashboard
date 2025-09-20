import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import {
  BarChart3,
  LineChart as LineIcon,
  PieChart as PieIcon,
  TrendingUp,
  Activity,
  Eye,
  Filter,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
  ComposedChart,
} from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const ChartsPanel = ({
  environmentalTrends = [],
  kpiTrends = [],
  selectedTimeRange,
  focusMode = "all",
}) => {
  const { isDarkMode } = useTheme();
  const [selectedChart, setSelectedChart] = useState("overview");

  const prepareEnvironmentalData = () => {
    return environmentalTrends.map((point) => ({
      time: format(new Date(point.timestamp), "dd/MM HH:mm"),
      temperature: point.temperature,
      humidity: point.humidity,
      rainfall: point.rainfall,
      windSpeed: point.windSpeed,
      uvIndex: point.uvIndex,
      soilMoisture: point.soilMoisture,
    }));
  };

  const prepareKPIData = () => {
    return kpiTrends.map((point) => ({
      time: format(new Date(point.date), "dd/MM"),
      totalRevenue: point.totalRevenue,
      averageEfficiency: point.averageEfficiency,
      averageGrowth: point.averageGrowth,
      weatherRisk: point.weatherRisk,
      productivityIndex: point.productivityIndex,
    }));
  };

  const prepareCombinedData = () => {
    if (environmentalTrends.length === 0 || kpiTrends.length === 0) return [];

    return environmentalTrends.slice(-7).map((envPoint, index) => {
      const kpiPoint = kpiTrends[Math.min(index, kpiTrends.length - 1)];
      return {
        time: format(new Date(envPoint.timestamp), "dd/MM"),
        temperature: envPoint.temperature,
        humidity: envPoint.humidity,
        efficiency: kpiPoint?.averageEfficiency || 0,
        revenue: kpiPoint?.totalRevenue || 0,
        weatherRisk: kpiPoint?.weatherRisk || 0,
      };
    });
  };

  const chartTypes = [
    {
      id: "overview",
      label: "Panoramica",
      icon: Eye,
      description: "Vista combinata di tutti i dati",
    },
    {
      id: "environmental",
      label: "Ambientale",
      icon: LineIcon,
      description: "Trend delle condizioni ambientali",
    },
    {
      id: "performance",
      label: "Performance",
      icon: TrendingUp,
      description: "KPI e indicatori di performance",
    },
    {
      id: "correlation",
      label: "Correlazioni",
      icon: Activity,
      description: "Analisi correlazioni ambiente-produzione",
    },
  ];

  const getChartTypesByFocus = () => {
    switch (focusMode) {
      case "environmental":
        return chartTypes.filter((t) =>
          ["overview", "environmental", "correlation"].includes(t.id)
        );
      case "production":
        return chartTypes.filter((t) =>
          ["overview", "performance", "correlation"].includes(t.id)
        );
      case "analytics":
        return chartTypes;
      default:
        return chartTypes;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-4 rounded-lg border shadow-lg ${
            isDarkMode
              ? "bg-gray-800 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}:{" "}
              {typeof entry.value === "number"
                ? entry.value.toFixed(1)
                : entry.value}
              {entry.name.includes("Temperatura")
                ? "°C"
                : entry.name.includes("Umidità")
                ? "%"
                : entry.name.includes("Vento")
                ? " km/h"
                : entry.name.includes("Efficienza")
                ? "%"
                : entry.name.includes("Ricavi")
                ? " €"
                : entry.name.includes("Rischio")
                ? "%"
                : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderOverviewChart = () => (
    <div className="space-y-6">
      <div className="chart-16x9">
        <h4 className="text-md font-semibold mb-4">Ambiente vs Performance</h4>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={prepareCombinedData()}>
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
              yAxisId="left"
              stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
              fontSize={12}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="temperature"
              fill="#ef4444"
              fillOpacity={0.3}
              stroke="#ef4444"
              strokeWidth={2}
              name="Temperatura"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="efficiency"
              stroke="#10b981"
              strokeWidth={3}
              name="Efficienza"
              dot={{ fill: "#10b981", strokeWidth: 0, r: 4 }}
            />
            <Bar
              yAxisId="left"
              dataKey="weatherRisk"
              fill="#f59e0b"
              fillOpacity={0.7}
              name="Rischio Meteo"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderEnvironmentalChart = () => (
    <div className="chart-16x9">
      <h4 className="text-md font-semibold mb-4">
        Condizioni Ambientali nel Tempo
      </h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={prepareEnvironmentalData()}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? "#374151" : "#e5e7eb"}
          />
          <XAxis
            dataKey="time"
            stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
            fontSize={12}
          />
          <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} fontSize={12} />
          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ef4444"
            strokeWidth={2}
            name="Temperatura"
            dot={{ fill: "#ef4444", strokeWidth: 0, r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Umidità"
            dot={{ fill: "#3b82f6", strokeWidth: 0, r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="windSpeed"
            stroke="#10b981"
            strokeWidth={2}
            name="Vento"
            dot={{ fill: "#10b981", strokeWidth: 0, r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="soilMoisture"
            stroke="#f59e0b"
            strokeWidth={2}
            name="Umidità Suolo"
            dot={{ fill: "#f59e0b", strokeWidth: 0, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderPerformanceChart = () => (
    <div className="chart-16x9">
      <h4 className="text-md font-semibold mb-4">Indicatori di Performance</h4>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={prepareKPIData()}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? "#374151" : "#e5e7eb"}
          />
          <XAxis
            dataKey="time"
            stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
            fontSize={12}
          />
          <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} fontSize={12} />
          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="averageEfficiency"
            stackId="1"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
            name="Efficienza Media"
          />
          <Area
            type="monotone"
            dataKey="averageGrowth"
            stackId="2"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            name="Crescita Media"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const renderCorrelationChart = () => (
    <div className="chart-16x9">
      <h4 className="text-md font-semibold mb-4">
        Correlazione Temperatura-Efficienza
      </h4>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={prepareCombinedData()}>
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
            yAxisId="temp"
            stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
            fontSize={12}
          />
          <YAxis
            yAxisId="eff"
            orientation="right"
            stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />

          <Bar
            yAxisId="temp"
            dataKey="temperature"
            fill="#ef4444"
            fillOpacity={0.7}
            name="Temperatura"
          />
          <Line
            yAxisId="eff"
            type="monotone"
            dataKey="efficiency"
            stroke="#10b981"
            strokeWidth={3}
            name="Efficienza"
            dot={{ fill: "#10b981", strokeWidth: 0, r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case "overview":
        return renderOverviewChart();
      case "environmental":
        return renderEnvironmentalChart();
      case "performance":
        return renderPerformanceChart();
      case "correlation":
        return renderCorrelationChart();
      default:
        return renderOverviewChart();
    }
  };

  const availableCharts = getChartTypesByFocus();

  return (
    <Card className="mx-0 sm:mx-0">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <BarChart3
              className={`w-6 h-6 ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <CardTitle className="text-xl font-bold">
              Analytics Avanzate
            </CardTitle>
          </div>

          <div className="flex items-center space-x-2">
            <Filter
              className={`w-4 h-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            />
            <Badge variant="outline">Periodo: {selectedTimeRange}</Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {availableCharts.map((chart) => {
            const IconComponent = chart.icon;
            return (
              <Button
                key={chart.id}
                onClick={() => setSelectedChart(chart.id)}
                variant={selectedChart === chart.id ? "default" : "outline"}
                size="sm"
                className="flex items-center space-x-2"
                title={chart.description}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{chart.label}</span>
              </Button>
            );
          })}
        </div>

        <div className="space-y-4">
          {renderSelectedChart()}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-500">Punti Dati</p>
              <p className="text-lg font-semibold">
                {environmentalTrends.length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Range Temporale</p>
              <p className="text-lg font-semibold">{selectedTimeRange}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Ultimo Aggiornamento</p>
              <p className="text-lg font-semibold">
                {environmentalTrends.length > 0
                  ? format(
                      new Date(
                        environmentalTrends[
                          environmentalTrends.length - 1
                        ].timestamp
                      ),
                      "HH:mm"
                    )
                  : "--:--"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Trend</p>
              <div className="flex items-center justify-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <p className="text-lg font-semibold text-green-500">+2.3%</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartsPanel;
