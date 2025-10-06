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

export interface TempoDataHistoryItem {
    minNO2: number;
    maxNO2: number;
    centerNO2: number;
    imageBytes: string;
    timestamp: string;
}


function moleculesToMicrogramsPerCubicMeter(
    moleculesPerM3: number,
    molecularWeight: number
): number {
    const AVOGADRO = 6.02214076e23; // molecules per mole

    // µg/m³ = (molecules/m³ × M / N_A) × 1e6
    return (moleculesPerM3 * molecularWeight / AVOGADRO) * 1e6;
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
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ground-based-air-quality/retrieve?lat=${lat}&lon=${lon}`);
            if (!response.ok) throw new Error('Failed to fetch Ground data');
            const data = await response.json();

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

    async getForecastData(lon: number, lat: number): Promise<any | null> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ground-based-air-quality/retrieveForecast?lat=${lat}&lon=${lon}`);
            if (!response.ok) throw new Error('Failed to fetch Forecast data');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching Forecast data:', error);
            return null;
        }
    },

    async getTempoData(lat1: number, lat2: number, lon1: number, lon2: number, retryCount = 0, maxRetries = 3): Promise<{ minNO2: number, maxNO2: number, centerNO2: number, imageBytes: string } | null> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/level-three/retrieve?lat1=${lat1}&lat2=${lat2}&lon1=${lon1}&lon2=${lon2}`, {
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) throw new Error('Failed to fetch Tempo data');

            const data = await response.json();


            data.centerNO2 = moleculesToMicrogramsPerCubicMeter(data.centerNO2, 46.0055)
            return {
                minNO2: data.minNO2,
                maxNO2: data.maxNO2,
                centerNO2: data.centerNO2,
                imageBytes: data.imagePng
            };
        } catch (error) {
            console.error('Error fetching TEMPO data:', error);

            // exponential backoff retry
            if (retryCount < maxRetries) {
                const newRetryCount = retryCount + 1;
                const delay = Math.min(1000 * Math.pow(2, newRetryCount - 1), 8000); // Max 8 seconds

                await new Promise(resolve => setTimeout(resolve, delay));
                return this.getTempoData(lat1, lat2, lon1, lon2, newRetryCount, maxRetries);
            } else {
                console.error("Max retries reached. Giving up.");
                return null;
            }
        }
    },

    async getTempoDataHistory(lat1: number, lat2: number, lon1: number, lon2: number, n: number, retryCount = 0, maxRetries = 3): Promise<TempoDataHistoryItem[] | null> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/level-three/retrieveN?lat1=${lat1}&lat2=${lat2}&lon1=${lon1}&lon2=${lon2}&n=${n}`, {
                signal: AbortSignal.timeout(15000)
            });

            if (!response.ok) throw new Error('Failed to fetch TEMPO history data');

            const dataList = await response.json();

            const processedData = dataList.map((item: any) => ({
                minNO2: item.minNO2,
                maxNO2: item.maxNO2,
                centerNO2: moleculesToMicrogramsPerCubicMeter(item.centerNO2, 46.0055),
                imageBytes: item.imagePng,
                timestamp: item.timestamp
            }));
            return processedData;
        } catch (error) {
            console.error('Error fetching TEMPO history data:', error);

            // exponential backoff retry
            if (retryCount < maxRetries) {
                const newRetryCount = retryCount + 1;
                const delay = Math.min(1000 * Math.pow(2, newRetryCount - 1), 8000);

                await new Promise(resolve => setTimeout(resolve, delay));
                return this.getTempoDataHistory(lat1, lat2, lon1, lon2, n, newRetryCount, maxRetries);
            } else {
                return null;
            }
        }
    },

    async getTempoDataFull(retryCount = 0, maxRetries = 3): Promise<{ minNO2: number, maxNO2: number, imageBytes: string, scaleFactor: number, generatedAt: string } | null> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/level-three/retrieveFull`, {
                signal: AbortSignal.timeout(15000)
            });

            if (!response.ok) throw new Error('Failed to fetch full TEMPO data');

            const data = await response.json();

            return {
                minNO2: data.minNO2,
                maxNO2: data.maxNO2,
                imageBytes: data.imagePng,
                scaleFactor: data.scaleFactor,
                generatedAt: data.generatedAtInstant
            };
        } catch (error) {

            // exponential backoff retry
            if (retryCount < maxRetries) {
                const newRetryCount = retryCount + 1;
                const delay = Math.min(1000 * Math.pow(2, newRetryCount - 1), 8000);

                await new Promise(resolve => setTimeout(resolve, delay));
                return this.getTempoDataFull(newRetryCount, maxRetries);
            } else {
                console.error("Max retries reached. Giving up.");
                return null;
            }
        }
    },

    async reverseGeocode(lat: number, lon: number) {
        try {
            const response = await fetch(`${import.meta.env.NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
            const data = await response.json();
            // Extract city name; fallback to display_name if city is not available
            return data.address?.city || data.address?.town || data.address?.village || data.display_name || 'Unknown';
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return 'Unknown';
        }
    }
}
