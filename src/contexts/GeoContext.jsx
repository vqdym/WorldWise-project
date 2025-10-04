import { createContext, useContext } from "react";
import { useGeolocation } from "../hooks/useGeolocation";

const GeoContext = createContext();

function GeoProvider({ children }) {
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  return (
    <GeoContext.Provider
      value={{
        isLoadingPosition,
        geolocationPosition,
        getPosition,
      }}
    >
      {children}
    </GeoContext.Provider>
  );
}

function useGeo() {
  const context = useContext(GeoContext);
  if (context === undefined)
    throw new Error("GeoContext was used outside the GeoContext");
  return context;
}

export { GeoProvider, useGeo };
