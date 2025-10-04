import { useGeo } from "../contexts/GeoContext";
import styles from "./YourGeo.module.css";
import Spinner from "./Spinner";
import { useState } from "react";
import BackButton from "./BackButton";
import { useSearchParams } from "react-router-dom";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useAuth } from "../contexts/FakeAuthContext";
import NeedToLogin from "./NeedToLogin";

function YourGeo() {
  const { isAuthenticated } = useAuth();
  const [lat, lng] = useUrlPosition();
  const [copied, setCopied] = useState(false);
  const { isLoadingPosition, geolocationPosition } = useGeo();

  const latToShow = lat ?? geolocationPosition?.lat;
  const lngToShow = lng ?? geolocationPosition?.lng;

  const link =
    latToShow && lngToShow
      ? `${window.location.origin}/app/yourgeo?lat=${latToShow}&lng=${lngToShow}`
      : "No location yet";

  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return isAuthenticated ? (
    !isLoadingPosition ? (
      <div className={styles.yourGeoContainer}>
        <p>You can copy your geolocation link</p>
        <div className={styles.inputWrapper}>
          <input type="text" readOnly value={link} />
          <button className={styles.copyButton} onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <BackButton to={`/app/cities`} />
      </div>
    ) : (
      <Spinner />
    )
  ) : (
    <NeedToLogin />
  );
}

export default YourGeo;
