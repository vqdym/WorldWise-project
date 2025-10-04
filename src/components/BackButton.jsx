import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useEffect } from "react";

function BackButton({ to = -1 }) {
  const navigate = useNavigate();
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        navigate(to);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [navigate, to]);

  return (
    <Button
      type="back"
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      &larr; Back
    </Button>
  );
}

export default BackButton;
