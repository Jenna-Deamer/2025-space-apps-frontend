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
    async getGroundData(lon: number, lat: number): Promise<GroundDataResponse | null> {
        const CACHE_KEY = `groundData_cache_${lon}_${lat}`;

        // Checking if we have cached data
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, expiresAt } = JSON.parse(cached);
            const now = new Date().getTime();

            // Returning cached data if not expired
            if (now < expiresAt) {
                console.log('Returning cached Ground data');
                return data;
            }
        }

        try {
            console.log('Fetching Ground data...');
            const response = await fetch(`http://localhost:8080/api/ground-based-air-quality/retrieve?lat=${lat}&lon=${lon}`);
            if (!response.ok) throw new Error('Failed to fetch Ground data');
            const data = await response.json();
            console.log(data);

            // Calculating expiration time (next hour at :00)
            const now = new Date();
            const expiresAt = new Date(now);
            expiresAt.setHours(expiresAt.getHours() + 1);
            expiresAt.setMinutes(0);
            expiresAt.setSeconds(0);
            expiresAt.setMilliseconds(0);

            // Saving to localStorage
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data,
                expiresAt: expiresAt.getTime()
            }));

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
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error fetching TEMPO data:', error);
            return null;
        }
    },

    async getForecastData() {
        try {
            console.log('Fetching Forecast data...');
            const response = await fetch('');
            if (!response.ok) throw new Error('Failed to fetch Forecast data');
            console.log(response.json());
            return await response.json();
        } catch (error) {
            console.error('Error fetching Forecast data:', error);
            return null;
        }
    },
    async reverseGeocode(lat: number, lon: number) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
            const data = await response.json();
            // Extract city name; fallback to display_name if city is not available
            return data.address?.city || data.address?.town || data.address?.village || data.display_name || 'Unknown';
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return 'Unknown';
        }
    }


}
