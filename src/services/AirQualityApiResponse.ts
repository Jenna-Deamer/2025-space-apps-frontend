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

    async getTempoData(lat1: number, lat2: number, lon1: number, lon2: number, retryCount = 0, maxRetries = 3): Promise<{ minNO2: number, maxNO2: number, imageBytes: string } | null> {
        try {
            console.log('Fetching TEMPO data...');
            const response = await fetch(`http://localhost:8080/api/level-three/retrieve?lat1=${lat1}&lat2=${lat2}&lon1=${lon1}&lon2=${lon2}`, {
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) throw new Error('Failed to fetch Tempo data');

            const data = await response.json();

            console.log('Min NO2:', data.minNO2);
            console.log('Max NO2:', data.maxNO2);

            return {
                minNO2: data.minNO2,
                maxNO2: data.maxNO2,
                imageBytes: data.imagePng
            };
        } catch (error) {
            console.error('Error fetching TEMPO data:', error);

            // exponential backoff retry
            if (retryCount < maxRetries) {
                const newRetryCount = retryCount + 1;
                const delay = Math.min(1000 * Math.pow(2, newRetryCount - 1), 8000); // Max 8 seconds

                console.log(`Retrying in ${delay}ms... (attempt ${newRetryCount}/${maxRetries})`);

                await new Promise(resolve => setTimeout(resolve, delay));
                return this.getTempoData(lat1, lat2, lon1, lon2, newRetryCount, maxRetries);
            } else {
                console.error("Max retries reached. Giving up.");
                return null;
            }
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
