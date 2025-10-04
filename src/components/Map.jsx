import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  Circle,
} from "react-leaflet";

import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeo } from "../contexts/GeoContext";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useAuth } from "../contexts/FakeAuthContext";

function Map() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { cities } = useCities();
  const [showButton, setShowButton] = useState(true);
  const [clickedYourPosition, setClickedYourPosition] = useState(false);
  const { isLoadingPosition, geolocationPosition, getPosition } = useGeo();
  const [yourPosition, setYourPosition] = useState(null);

  const [mapLat, mapLng] = useUrlPosition();

  useEffect(() => {
    if (!clickedYourPosition) return;
    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setYourPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [clickedYourPosition]);

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPosition) {
        navigate(
          `yourgeo?lat=${geolocationPosition.lat}&lng=${geolocationPosition.lng}`
        );
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
        setShowButton(false);
      }
    },
    [geolocationPosition]
  );

  const handleClick = async (e) => {
    e.preventDefault();
    await getPosition();
    navigate("yourgeo");
    setClickedYourPosition(true);
  };

  return (
    <div className={styles.mapContainer}>
      {showButton && isAuthenticated && (
        <NavLink className={styles.btn} to="yourgeo" onClick={handleClick}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </NavLink>
      )}
      <MapContainer
        center={mapPosition}
        zoom={15}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* rendering marker only if coordinates exist and marker does not overlap live position or city (IIFE)*/}
        {mapLat &&
          mapLng &&
          (() => {
            const urlLat = parseFloat(mapLat);
            const urlLng = parseFloat(mapLng);

            const isLivePos =
              yourPosition &&
              urlLat === yourPosition[0] &&
              urlLng === yourPosition[1];
            const isCityPos = cities.some(
              (city) =>
                city.position.lat === urlLat && city.position.lng === urlLng
            );

            if (!isLivePos && !isCityPos) {
              return <Marker position={[urlLat, urlLng]} />;
            }

            return null;
          })()}

        {/* Rendering a live position circle:
          - Only shows after user clicks "Use your position" button (clickedYourPosition)
          - Updates as the user moves (yourPosition)
          - Blue circle with semi-transparent fill, radius 20 meters */}
        {isAuthenticated && clickedYourPosition && yourPosition && (
          <Circle
            center={yourPosition}
            radius={20} // радіус кружка в метрах
            pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.3 }}
          />
        )}

        {isAuthenticated &&
          cities.map((city) => (
            <Marker
              position={[city.position.lat, city.position.lng]}
              key={city.id}
            >
              <Popup>
                <span>{city.emoji}</span> <span>{city.cityName}</span>
              </Popup>
            </Marker>
          ))}
        <ChangeCenter
          position={mapPosition}
          userPosition={geolocationPosition}
          setShowButton={setShowButton}
        />
        {isAuthenticated ? <DetectClick /> : <NonAuthenticatedClick />}
        <DetectMove
          userPosition={geolocationPosition}
          setShowButton={setShowButton}
        />
      </MapContainer>
    </div>
  );
}
function ChangeCenter({ position, userPosition, setShowButton }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);

    if (userPosition) {
      const distance = map.distance(map.getCenter(), userPosition);
      setShowButton(distance > 10000);
    }
  }, [position, userPosition, map, setShowButton]);

  return null;
}

function NonAuthenticatedClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) =>
      navigate(`/app/cities?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

function DetectMove({ userPosition, setShowButton }) {
  const map = useMapEvents({
    moveend: () => {
      if (!userPosition) return;

      const distance = map.distance(map.getCenter(), userPosition);

      if (distance > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    },
  });
  return null;
}

export default Map;
