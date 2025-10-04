export interface TempoData {
    no2: number; // Nitrogen dioxide in ppb
    ch2o: number; // Formaldehyde in ppb
    ai: number; // Aerosol Index
    pm: number; // Particulate matter in µg/m³
    o3: number; // Ozone in ppb
}

export interface GroundData {
    pm25: number; // PM2.5 in µg/m³
    aqi: number; // Air Quality Index
    category: string; // e.g., "Good", "Moderate"
    station: string; // Station name, e.g., "Barrie"
}

export interface AirQualityApiResponse {
    tempoData: TempoData;
    groundData: GroundData;
}

export const airQualityService = {
    async getGroundData(): Promise<GroundData | null> {
        try {
            console.log('Fetching Ground data...');
            const response = await fetch('http://localhost:8080/api/ground-based-air-quality/retrieve');
            if (!response.ok) throw new Error('Failed to fetch Ground data');
              console.log(response.json());
            return await response.json();
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