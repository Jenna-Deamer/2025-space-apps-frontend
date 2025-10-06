export { };

declare global {
    interface Window {
        googleMapsReady?: boolean;
        initGoogleMaps?: () => void;
        google?: typeof google;
    }
}
