import { useState } from "react";
import { useSimulatedData } from "../hooks/useSimulatedData";
import { useTheme } from "../hooks/useTheme";
import DashboardHeader from "./DashboardHeader";
import KPICards from "./KPICards";
import EnvironmentalPanel from "./EnvironmentalPanel";
import ProductionPanel from "./ProductionPanel";
import ChartsPanel from "./ChartsPanel";
import LoadingSpinner from "./LoadingSpinner";
import ErrorDisplay from "./ErrorDisplay";
import ControlPanel from "./ControlPanel";

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [viewMode, setViewMode] = useState("overview");

  const {
    currentData,
    historicalData,
    isLoading,
    error,
    isRealTimeActive,
    toggleRealTime,
    refreshData,
    resetSimulation,
    getEnvironmentalTrends,
    getProductionTrends,
    getKPITrends,
  } = useSimulatedData(5000);

  if (isLoading) {
    return <LoadingSpinner message="Caricamento dati azienda agricola..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refreshData} />;
  }

  if (!currentData) {
    return (
      <ErrorDisplay error="Nessun dato disponibile" onRetry={resetSimulation} />
    );
  }

  const timeRangeMap = {
    "1d": 1,
    "3d": 3,
    "7d": 7,
    "15d": 15,
    "30d": 30,
  };

  const days = timeRangeMap[selectedTimeRange];

  return (
    <div
      className={`min-h-screen transition-all duration-500 ease-in-out ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      <div className=" top-0 z-50 backdrop-blur-md border-b border-opacity-20 flex flex-col gap-3">
        <DashboardHeader
          currentData={currentData}
          isRealTimeActive={isRealTimeActive}
          onToggleRealTime={toggleRealTime}
          onRefresh={refreshData}
          onReset={resetSimulation}
        />

        <ControlPanel
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={setSelectedTimeRange}
          selectedCrop={selectedCrop}
          onCropChange={setSelectedCrop}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          productionData={currentData.production}
        />
      </div>

      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <main className="py-12 lg:py-16 space-y-12 lg:space-y-16">
          {viewMode === "overview" && (
            <>
              <KPICards kpis={currentData.kpis} trends={getKPITrends(days)} />

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 lg:gap-12">
                <EnvironmentalPanel
                  currentData={currentData.environmental}
                  trends={getEnvironmentalTrends(days)}
                  className="xl:col-span-7"
                />

                <ProductionPanel
                  productionData={currentData.production}
                  trends={getProductionTrends(
                    selectedCrop === "all" ? null : selectedCrop,
                    days
                  )}
                  selectedCrop={selectedCrop}
                  className="xl:col-span-5"
                />
              </div>

              <ChartsPanel
                environmentalTrends={getEnvironmentalTrends(days)}
                productionTrends={getProductionTrends(null, days)}
                kpiTrends={getKPITrends(days)}
                selectedTimeRange={selectedTimeRange}
              />
            </>
          )}

          {viewMode === "environmental" && (
            <div className="space-y-8 lg:space-y-10">
              <EnvironmentalPanel
                currentData={currentData.environmental}
                trends={getEnvironmentalTrends(days)}
                expanded={true}
              />
              <ChartsPanel
                environmentalTrends={getEnvironmentalTrends(days)}
                selectedTimeRange={selectedTimeRange}
                focusMode="environmental"
              />
            </div>
          )}

          {viewMode === "production" && (
            <div className="space-y-8 lg:space-y-10">
              <ProductionPanel
                productionData={currentData.production}
                trends={getProductionTrends(
                  selectedCrop === "all" ? null : selectedCrop,
                  days
                )}
                selectedCrop={selectedCrop}
                expanded={true}
              />
              <ChartsPanel
                productionTrends={getProductionTrends(null, days)}
                selectedTimeRange={selectedTimeRange}
                focusMode="production"
              />
            </div>
          )}

          {viewMode === "analytics" && (
            <div className="space-y-8 lg:space-y-10">
              <KPICards
                kpis={currentData.kpis}
                trends={getKPITrends(days)}
                expanded={true}
              />
              <ChartsPanel
                environmentalTrends={getEnvironmentalTrends(days)}
                productionTrends={getProductionTrends(null, days)}
                kpiTrends={getKPITrends(days)}
                selectedTimeRange={selectedTimeRange}
                focusMode="analytics"
              />
            </div>
          )}
        </main>

        <footer
          className={`mt-16 lg:mt-20 border-t backdrop-blur-sm px-4 ${
            isDarkMode
              ? "border-gray-700/50 bg-gray-800/80"
              : "border-gray-200/50 bg-white/80"
          } py-8`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-sm text-gray-500">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">
              <span className="font-medium">
                Dashboard Agricolo "Terra Verde"
              </span>
              <span className="hidden sm:inline">•</span>
              <span>Punti dati: {historicalData.length}</span>
              <span className="hidden sm:inline">•</span>
              <span>
                Ultimo aggiornamento:{" "}
                {currentData.timestamp.toLocaleTimeString("it-IT")}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  isRealTimeActive
                    ? isDarkMode
                      ? "bg-green-900/30 text-green-400"
                      : "bg-green-100 text-green-700"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isRealTimeActive
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-400"
                  }`}
                ></span>
                <span className="text-xs font-medium">
                  {isRealTimeActive ? "Live" : "Paused"}
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
