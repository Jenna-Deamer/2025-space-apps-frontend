<template>
  <aside class="sidebar-content">
    <!-- Air Quality Overview Card -->
    <section class="card aqi-overview">
      <h2>Air Quality</h2>
      <div class="aqi-value" :class="aqiLevelClass">42 (Good)</div>
      <div class="main-pollutant">Main pollutant: NO2</div>
      <div class="health-advice">Air quality is good. Safe to go outside.</div>
    </section>

    <!-- TEMPO Data Card -->
    <section class="card tempo-data">
      <h2>TEMPO Satellite Data</h2>
      <div>NO2: 14 ppb</div>
      <div>Ozone: 30 ppb</div>
      <div>Aerosol Index: 1.2</div>
    </section>

    <!-- Ground Data Card -->
    <section class="card ground-data">
      <h2>Ground Station Data</h2>
      <div>PM2.5: 12 µg/m³</div>
      <div>AQI: 50 (Moderate)</div>
      <div>Station: Orillia Campus</div>

    </section>

    <!-- Forecast Card -->
    <section class="card forecast">
      <h2>Air Quality Forecast</h2>
      <div class="forecast-day" v-for="day in forecast" :key="day.date">
        <div>{{ day.date }}</div>
        <div :class="day.aqiClass">{{ day.aqi }} ({{ day.category }})</div>
        <div>{{ day.advice }}</div>
      </div>
    </section>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      aqiLevelClass: 'good',
      forecast: [
        { date: 'Oct 5', aqi: 55, category: 'Moderate', aqiClass: 'moderate', advice: 'Limit prolonged outdoor time' },
        { date: 'Oct 6', aqi: 70, category: 'Unhealthy for Sensitive Groups', aqiClass: 'unhealthy', advice: 'Wear a mask outdoors' },
      ],
    };
  },
};
</script>

<style scoped>
.sidebar-content {
  background-color: #f0f0f0;
  padding: 0.5rem;
  height: 100%;
  color: #000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
}

.card {
  background: white;
  padding: 0.75rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.aqi-value.good {
  color: #4caf50; 
  font-weight: 700;
}

.aqi-value.moderate {
  color: #ff9800; 
  font-weight: 700;
}

.aqi-value.unhealthy {
  color: #f44336; 
  font-weight: 700;
}

.forecast-day {
  border-top: 1px solid #eee;
  padding: 0.5rem 0;
}

.forecast-day:first-child {
  border-top: none;
}

.moderate {
  color: #ff9800;
}

.unhealthy {
  color: #f44336;
}
</style>
