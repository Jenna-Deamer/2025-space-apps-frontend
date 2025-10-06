<template>
  <footer>
    <section class="footer-section challenge">
      <h4>Challenge</h4>
      <p>
        <a href="https://www.spaceappschallenge.org/2025/challenges/from-earthdata-to-action-cloud-computing-with-earth-observation-data-for-predicting-cleaner-safer-skies/"
           target="_blank" rel="noopener noreferrer" aria-label="NASA Space Apps 2025 Challenge: From EarthData to Action">
           NASA Space Apps 2025 – From EarthData to Action
        </a>
      </p>
    </section>

    <section class="footer-section resources">
      <h4>Resources</h4>
      <ul>
        <li>
          <a href="https://www.earthdata.nasa.gov/data/instruments/tempo" target="_blank" rel="noopener noreferrer" aria-label="TEMPO Instrument on NASA EarthData">
            TEMPO Data (NASA EarthData)
          </a>
        </li>
        <li>
          <a href="https://openweathermap.org/api/air-pollution" target="_blank" rel="noopener noreferrer" aria-label="OpenWeather API for Air Pollution Data">
            Ground Data: OpenWeather API
          </a>
        </li>
      </ul>
    </section>

    <section class="footer-section credits">
      <h4>Credits</h4>
      <p>
        Built by 
        <a href="https://github.com/chrisbarbati" target="_blank" rel="noopener noreferrer" aria-label="Christian Barbati's GitHub Profile">Christian Barbati</a>, 
        <a href="https://github.com/insertusernamed" target="_blank" rel="noopener noreferrer" aria-label="Daniel Yevtushenko's GitHub Profile">Daniel Yevtushenko</a>, and 
        <a href="https://github.com/Jenna-Deamer" target="_blank" rel="noopener noreferrer" aria-label="Jenna Deamer's GitHub Profile">Jenna Deamer</a>
      </p>
    </section>
    <section class="footer-section github">
        <h4>Code Repositories</h4>
        <p> <a href="https://github.com/Jenna-Deamer/2025-space-apps-frontend" target="_blank" rel="noopener noreferrer" aria-label="Frontend Repository on GitHub">Frontend</a></p>
        <p> <a href="https://github.com/chrisbarbati/SpaceApps2025Backend" target="_blank" rel="noopener noreferrer" aria-label="Backend Repository on GitHub">Backend</a></p>
       
       
    </section>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  justify-content: space-between;
  padding: 1.5em 2em;
  font-size: 0.9rem;
  border-top: #102136 3px solid;
  flex-wrap: wrap;
}

.footer-section {
  flex: 1;
  min-width: 220px;
  margin: 0.5em;
}

footer h4 {
  margin-bottom: 0.5em;
  font-weight: 600;
}

footer ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

footer li {
  margin: 0.3em 0;
}

footer a {
  color: var(--text-color);
  transition: .3s ease-in-out color;
  
}

footer a:hover {
  color: var(--action-color-hover);
}
</style>
