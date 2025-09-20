import { useTheme } from "../hooks/useTheme";
import {
  Clock,
  Filter,
  BarChart3,
  Eye,
  Leaf,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ControlPanel = ({
  selectedTimeRange,
  onTimeRangeChange,
  selectedCrop,
  onCropChange,
  viewMode,
  onViewModeChange,
  productionData,
}) => {
  const { isDarkMode } = useTheme();

  const timeRangeOptions = [
    { value: "1d", label: "1 Giorno", icon: "📅" },
    { value: "3d", label: "3 Giorni", icon: "📅" },
    { value: "7d", label: "1 Settimana", icon: "📊" },
    { value: "15d", label: "15 Giorni", icon: "📈" },
    { value: "30d", label: "1 Mese", icon: "📋" },
  ];

  const viewModeOptions = [
    {
      value: "overview",
      label: "Panoramica",
      icon: Eye,
      description: "Vista generale dell'azienda",
    },
    {
      value: "environmental",
      label: "Ambientale",
      icon: Leaf,
      description: "Condizioni meteorologiche e ambientali",
    },
    {
      value: "production",
      label: "Produzione",
      icon: TrendingUp,
      description: "Dettagli colture e produttività",
    },
    {
      value: "analytics",
      label: "Analytics",
      icon: Activity,
      description: "KPI e analisi avanzate",
    },
  ];

  const cropOptions = [
    { value: "all", label: "Tutte le Colture", icon: "🌾" },
    ...Object.entries(productionData).map(([key, crop]) => ({
      value: key,
      label: crop.name,
      icon: getCropIcon(key),
    })),
  ];

  function getCropIcon(cropType) {
    const icons = {
      wheat: "🌾",
      corn: "🌽",
      tomatoes: "🍅",
      olives: "🫒",
    };
    return icons[cropType] || "🌱";
  }

  return (
    <div
      className={`border-b transition-all duration-300 backdrop-blur-sm  top-[68px] z-40 ${
        isDarkMode
          ? "bg-gray-800/90 border-gray-700/50"
          : "bg-white/90 border-gray-200/50"
      }`}
    >
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-5 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              <BarChart3 className="w-5 h-5" />
              <span>Vista Dashboard:</span>
            </div>

            <div className="flex flex-wrap gap-3">
              {viewModeOptions.map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <Button
                    key={mode.value}
                    onClick={() => onViewModeChange(mode.value)}
                    variant={viewMode === mode.value ? "default" : "outline"}
                    className="flex items-center space-x-3 h-auto px-5 py-3"
                    title={mode.description}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-sm font-medium">{mode.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                <Clock className="w-5 h-5" />
                <span>Periodo:</span>
              </div>

              <Select
                value={selectedTimeRange}
                onValueChange={onTimeRangeChange}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Seleziona periodo" />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center space-x-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(viewMode === "production" || viewMode === "overview") && (
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  <Filter className="w-5 h-5" />
                  <span>Coltura:</span>
                </div>

                <Select value={selectedCrop} onValueChange={onCropChange}>
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Seleziona coltura" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center space-x-2">
                          <span>{option.icon}</span>
                          <span>{option.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {(selectedCrop !== "all" || viewMode !== "overview") && (
          <div className="mt-6 pt-5 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex flex-wrap gap-4">
              {viewMode !== "overview" && (
                <Badge variant="info" className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>
                    Vista:{" "}
                    {viewModeOptions.find((m) => m.value === viewMode)?.label}
                  </span>
                </Badge>
              )}

              {selectedCrop !== "all" && (
                <Badge
                  variant="success"
                  className="flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>
                    Coltura:{" "}
                    {cropOptions.find((c) => c.value === selectedCrop)?.label}
                  </span>
                </Badge>
              )}

              <Badge
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <Clock className="w-4 h-4" />
                <span>
                  Periodo:{" "}
                  {
                    timeRangeOptions.find((t) => t.value === selectedTimeRange)
                      ?.label
                  }
                </span>
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
