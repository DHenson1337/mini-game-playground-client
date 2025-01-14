import { useEffect } from "react";
import "./styles/SuccessMessage.css";

//Message that plays on a Succsessful login

const SuccessMessage = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="success-message-overlay">
      <div className="sucess-message">
        <h2>Welcome!</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SuccessMessage;
