import { useState, useEffect, useCallback, useRef } from 'react';
import { DataSimulator } from '../services/dataSimulator';

export const useSimulatedData = (updateInterval = 5000) => {
  const [currentData, setCurrentData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);

  const simulatorRef = useRef(new DataSimulator());
  const intervalRef = useRef(null);
  const growthDataRef = useRef({});

  const generateNewData = useCallback(() => {
    try {
      const simulator = simulatorRef.current;

      const environmentalData = simulator.generateEnvironmentalData();

      const productionData = simulator.generateProductionData(
        environmentalData,
        growthDataRef.current
      );

      Object.keys(productionData).forEach(crop => {
        growthDataRef.current[crop] = productionData[crop].growthPercentage;
      });

      const kpis = calculateKPIs(productionData, environmentalData);

      const newDataPoint = {
        id: Date.now(),
        timestamp: new Date(),
        environmental: environmentalData,
        production: productionData,
        kpis
      };

      setCurrentData(newDataPoint);

      setHistoricalData(prev => {
        const updated = [...prev, newDataPoint];
        return updated.length > 100 ? updated.slice(-100) : updated;
      });

      setError(null);
    } catch (err) {
      setError(`Errore nella generazione dati: ${err.message}`);
      console.error('Errore simulazione dati:', err);
    }
  }, []);

  const calculateKPIs = (productionData, environmentalData) => {
    const crops = Object.values(productionData);

    const totalArea = crops.reduce((sum, crop) => sum + crop.area, 0);
    const totalRevenue = crops.reduce((sum, crop) => sum + crop.estimatedRevenue, 0);
    const totalProduction = crops.reduce((sum, crop) => sum + crop.currentProduction, 0);
    const avgEfficiency = crops.reduce((sum, crop) => sum + crop.efficiency, 0) / crops.length;
    const avgGrowth = crops.reduce((sum, crop) => sum + crop.growthPercentage, 0) / crops.length;

    const temperatureRisk = calculateTemperatureRisk(environmentalData.temperature);
    const waterStress = calculateWaterStress(environmentalData.rainfall, environmentalData.soilMoisture);
    const weatherRisk = (temperatureRisk + waterStress) / 2;

    return {
      totalArea,
      totalRevenue,
      totalProduction,
      averageEfficiency: Math.round(avgEfficiency),
      averageGrowth: Math.round(avgGrowth * 10) / 10,
      weatherRisk: Math.round(weatherRisk),
      profitPerHectare: Math.round(totalRevenue / totalArea),
      productivityIndex: Math.round((totalProduction / totalArea) * 100) / 100
    };
  };

  const calculateTemperatureRisk = (temperature) => {
    if (temperature < 5 || temperature > 35) return 80;
    if (temperature < 10 || temperature > 30) return 50;
    if (temperature < 15 || temperature > 25) return 20;
    return 0;
  };

  const calculateWaterStress = (rainfall, soilMoisture) => {
    const waterIndex = (rainfall * 2 + soilMoisture) / 3;
    if (waterIndex < 20) return 90;
    if (waterIndex < 40) return 60;
    if (waterIndex < 60) return 30;
    return 0;
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const simulator = simulatorRef.current;
        const historical = simulator.generateHistoricalData(30);

        const formattedHistorical = historical.map((day, index) => ({
          id: index,
          timestamp: new Date(day.date),
          environmental: day.environmental,
          production: day.production,
          kpis: calculateKPIs(day.production, day.environmental)
        }));

        setHistoricalData(formattedHistorical);

        if (formattedHistorical.length > 0) {
          const lastData = formattedHistorical[formattedHistorical.length - 1];
          setCurrentData(lastData);

          Object.keys(lastData.production).forEach(crop => {
            growthDataRef.current[crop] = lastData.production[crop].growthPercentage;
          });
        }

        setIsLoading(false);
      } catch (err) {
        setError(`Errore nell'inizializzazione: ${err.message}`);
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (isRealTimeActive && !isLoading) {
      intervalRef.current = setInterval(generateNewData, updateInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isRealTimeActive, isLoading, generateNewData, updateInterval]);

  const toggleRealTime = useCallback(() => {
    setIsRealTimeActive(prev => !prev);
  }, []);

  const refreshData = useCallback(() => {
    generateNewData();
  }, [generateNewData]);

  const resetSimulation = useCallback(() => {
    growthDataRef.current = {};
    setHistoricalData([]);
    setCurrentData(null);
    setIsLoading(true);

    setTimeout(() => {
      const simulator = new DataSimulator();
      simulatorRef.current = simulator;

      const historical = simulator.generateHistoricalData(30);
      const formattedHistorical = historical.map((day, index) => ({
        id: index,
        timestamp: new Date(day.date),
        environmental: day.environmental,
        production: day.production,
        kpis: calculateKPIs(day.production, day.environmental)
      }));

      setHistoricalData(formattedHistorical);
      if (formattedHistorical.length > 0) {
        setCurrentData(formattedHistorical[formattedHistorical.length - 1]);
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const getEnvironmentalTrends = useCallback((days = 7) => {
    return historicalData
      .slice(-days)
      .map(data => ({
        date: data.timestamp,
        ...data.environmental
      }));
  }, [historicalData]);

  const getProductionTrends = useCallback((cropType = null, days = 7) => {
    return historicalData
      .slice(-days)
      .map(data => {
        if (cropType) {
          return {
            date: data.timestamp,
            ...data.production[cropType]
          };
        }
        return {
          date: data.timestamp,
          production: data.production
        };
      });
  }, [historicalData]);

  const getKPITrends = useCallback((days = 7) => {
    return historicalData
      .slice(-days)
      .map(data => ({
        date: data.timestamp,
        ...data.kpis
      }));
  }, [historicalData]);

  return {
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

    updateInterval,
    dataPointsCount: historicalData.length
  };
};
