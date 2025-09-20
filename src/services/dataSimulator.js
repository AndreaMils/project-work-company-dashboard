import { format, subDays } from 'date-fns';

const CROPS = {
  wheat: {
    name: 'Grano',
    area: 25, // ettari
    plantingMonth: 10,
    harvestMonth: 6,
    avgYieldPerHa: 5.5,
    pricePerTon: 250,
    growthDays: 240,
    optimalTemp: { min: 15, max: 25 },
    optimalHumidity: { min: 60, max: 80 },
    waterNeed: 400
  },
  corn: {
    name: 'Mais',
    area: 20,
    plantingMonth: 4,
    harvestMonth: 9,
    avgYieldPerHa: 8.5,
    pricePerTon: 220,
    growthDays: 150,
    optimalTemp: { min: 20, max: 30 },
    optimalHumidity: { min: 70, max: 85 },
    waterNeed: 500
  },
  tomatoes: {
    name: 'Pomodori',
    area: 5,
    plantingMonth: 3,
    harvestMonth: 8,
    avgYieldPerHa: 45,
    pricePerTon: 400,
    growthDays: 120,
    optimalTemp: { min: 18, max: 28 },
    optimalHumidity: { min: 65, max: 80 },
    waterNeed: 600
  },
  olives: {
    name: 'Olive',
    area: 15,
    plantingMonth: 0,
    harvestMonth: 10,
    avgYieldPerHa: 3.5,
    pricePerTon: 800,
    growthDays: 365,
    optimalTemp: { min: 15, max: 30 },
    optimalHumidity: { min: 50, max: 70 },
    waterNeed: 300
  }
};

class DataSimulator {
  constructor() {
    this.currentDate = new Date();
    this.baseTemperature = 20;
    this.baseHumidity = 65;
    this.baseRainfall = 0;
    this.season = this.getCurrentSeason();
  }

  getCurrentSeason() {
    const month = this.currentDate.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  normalRandom(mean, stdDev) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();

    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return z * stdDev + mean;
  }

  generateTemperature() {
    const seasonalAdjustment = {
      spring: 0,
      summer: 8,
      autumn: -2,
      winter: -12
    };

    const hourlyVariation = Math.sin((new Date().getHours() - 6) * Math.PI / 12) * 5;
    const seasonalTemp = this.baseTemperature + seasonalAdjustment[this.season];
    const dailyNoise = this.normalRandom(0, 3);

    return Math.max(0, seasonalTemp + hourlyVariation + dailyNoise);
  }

  generateHumidity(temperature) {
    const baseHumidity = 90 - (temperature * 1.5);
    const noise = this.normalRandom(0, 8);

    return Math.max(20, Math.min(100, baseHumidity + noise));
  }

  generateRainfall() {
    const seasonalProbability = {
      spring: 0.3,
      summer: 0.15,
      autumn: 0.4,
      winter: 0.35
    };

    if (Math.random() < seasonalProbability[this.season]) {
      return Math.min(50, -Math.log(Math.random()) * 8);
    }
    return 0;
  }

  generateWindSpeed() {
    const baseWind = 10;
    const seasonalWind = {
      spring: 3,
      summer: -2,
      autumn: 5,
      winter: 8
    };

    return Math.max(0, this.normalRandom(baseWind + seasonalWind[this.season], 4));
  }

  generateUVIndex() {
    const hour = new Date().getHours();
    const seasonalUV = {
      spring: 6,
      summer: 9,
      autumn: 4,
      winter: 2
    };

    if (hour < 6 || hour > 18) return 0;

    const hourlyMultiplier = Math.sin((hour - 6) * Math.PI / 12);
    return Math.max(0, seasonalUV[this.season] * hourlyMultiplier);
  }

  calculateCropGrowth(cropType, environmentalData) {
    const crop = CROPS[cropType];
    const { temperature, humidity, rainfall } = environmentalData;

    const tempStress = this.calculateStressFactor(
      temperature,
      crop.optimalTemp.min,
      crop.optimalTemp.max
    );

    const humidityStress = this.calculateStressFactor(
      humidity,
      crop.optimalHumidity.min,
      crop.optimalHumidity.max
    );

    const waterAvailability = Math.min(1, rainfall / 5);

    const baseGrowth = 100 / crop.growthDays;

    const actualGrowth = baseGrowth * tempStress * humidityStress *
      (0.7 + 0.3 * waterAvailability);

    return Math.max(0, actualGrowth);
  }

  calculateStressFactor(value, optimalMin, optimalMax) {
    if (value >= optimalMin && value <= optimalMax) {
      return 1.0;
    }

    const tolerance = (optimalMax - optimalMin) * 0.5;
    const distance = Math.min(
      Math.abs(value - optimalMin),
      Math.abs(value - optimalMax)
    );

    return Math.max(0.2, 1 - (distance / tolerance) * 0.6);
  }

  generateCropProduction(cropType, growthPercentage) {
    const crop = CROPS[cropType];
    const maturityFactor = Math.min(1, growthPercentage / 100);

    const variabilityFactor = this.normalRandom(1, 0.15);
    const expectedYield = crop.avgYieldPerHa * crop.area * maturityFactor * variabilityFactor;

    return Math.max(0, expectedYield);
  }

  calculateRevenue(cropType, production) {
    const crop = CROPS[cropType];
    const marketVariability = this.normalRandom(1, 0.1);
    const currentPrice = crop.pricePerTon * marketVariability;

    return production * currentPrice;
  }

  generateEnvironmentalData() {
    const temperature = this.generateTemperature();
    const humidity = this.generateHumidity(temperature);
    const rainfall = this.generateRainfall();
    const windSpeed = this.generateWindSpeed();
    const uvIndex = this.generateUVIndex();

    return {
      timestamp: new Date().toISOString(),
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(humidity * 10) / 10,
      rainfall: Math.round(rainfall * 10) / 10,
      windSpeed: Math.round(windSpeed * 10) / 10,
      uvIndex: Math.round(uvIndex * 10) / 10,
      soilMoisture: Math.max(20, Math.min(100, humidity - 10 + this.normalRandom(0, 5))),
      atmosphericPressure: this.normalRandom(1013, 15)
    };
  }

  generateProductionData(environmentalData, previousGrowthData = {}) {
    const productionData = {};

    Object.keys(CROPS).forEach(cropType => {
      const currentGrowth = previousGrowthData[cropType] || 0;
      const growthIncrement = this.calculateCropGrowth(cropType, environmentalData);
      const newGrowth = Math.min(100, currentGrowth + growthIncrement);

      const production = this.generateCropProduction(cropType, newGrowth);
      const revenue = this.calculateRevenue(cropType, production);

      productionData[cropType] = {
        name: CROPS[cropType].name,
        area: CROPS[cropType].area,
        growthPercentage: Math.round(newGrowth * 10) / 10,
        currentProduction: Math.round(production * 100) / 100,
        estimatedRevenue: Math.round(revenue),
        efficiency: Math.round((production / (CROPS[cropType].avgYieldPerHa * CROPS[cropType].area)) * 100),
        status: this.getCropStatus(newGrowth, cropType)
      };
    });

    return productionData;
  }

  getCropStatus(growthPercentage, cropType) {
    const crop = CROPS[cropType];
    const currentMonth = new Date().getMonth();

    if (growthPercentage < 25) return 'Piantagione/Germinazione';
    if (growthPercentage < 50) return 'Crescita Vegetativa';
    if (growthPercentage < 75) return 'Fioritura/Allegagione';
    if (growthPercentage < 95) return 'Maturazione';
    if (currentMonth === crop.harvestMonth) return 'Raccolta';
    return 'Completato';
  }

  generateHistoricalData(days = 30) {
    const historicalData = [];
    let growthData = {};

    for (let i = days; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const envData = this.generateEnvironmentalData();
      envData.timestamp = date.toISOString();

      const prodData = this.generateProductionData(envData, growthData);

      Object.keys(prodData).forEach(crop => {
        growthData[crop] = prodData[crop].growthPercentage;
      });

      historicalData.push({
        date: format(date, 'yyyy-MM-dd'),
        environmental: envData,
        production: prodData
      });
    }

    return historicalData;
  }
}

export { DataSimulator, CROPS };
