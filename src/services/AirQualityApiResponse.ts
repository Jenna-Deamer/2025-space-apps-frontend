export interface TempoData {
    no2: number; // Nitrogen dioxide in ppb
    ch2o: number; // Formaldehyde in ppb
    ai: number; // Aerosol Index
    pm: number; // Particulate matter in µg/m³
    o3: number; // Ozone in ppb
    min: string; 
    max: string; 
}


interface Coord {
  lon: number;
  lat: number;
}

interface Main {
  aqi: number;
}

interface Components {
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

interface AirPollutionItem {
  main: Main;
  components: Components;
  dt: number;
}

interface GroundDataResponse {
  coord: Coord;
  list: AirPollutionItem[];
}

export interface AirQualityApiResponse {
    tempoData: TempoData;
    groundData: GroundDataResponse;
}

export const airQualityService = {
    async getGroundData(): Promise<GroundDataResponse | null> {
        try {
            console.log('Fetching Ground data...');
            const response = await fetch('http://localhost:8080/api/ground-based-air-quality/retrieve');
            if (!response.ok) throw new Error('Failed to fetch Ground data');
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error fetching Ground data:', error);
            return null;
        }
    },

    async getTempoData(): Promise<TempoData | null> {
        try {
            console.log('Fetching TEMPO data...');
            const response = await fetch('http://localhost:8080/api/level-three/retrieve');
            if (!response.ok) throw new Error('Failed to fetch Tempo data');
            console.log(response.json());
            return await response.json();
        } catch (error) {
            console.error('Error fetching TEMPO data:', error);
            return null;
        }
    }
}
