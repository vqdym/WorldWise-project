import { NavLink } from "react-router-dom";
import styles from "./NeedToLogin.module.css";
import Message from "./Message";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useAuth } from "../contexts/FakeAuthContext";

function NeedToLogin() {
  const [lat, lng] = useUrlPosition();
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.NeedToLoginContainer}>
      <Message message="Login to see any data" />
      <NavLink
        className={styles.btnLogin}
        to={
          !isAuthenticated
            ? lat && lng
              ? `/login?lat=${lat}&lng=${lng}`
              : `/login`
            : ""
        }
      >
        Login
      </NavLink>
    </div>
  );
}

export default NeedToLogin;

// useEffect(
//     function () {
//       if (isAuthenticated) {
//         lat && lng
//           ? navigate(`/app/form?lat=${lat}&lng=${lng}`, { replace: true })
//           : navigate("/app", { replace: true });
//       }
//     },
//     [isAuthenticated, lat, lng]
//   );
