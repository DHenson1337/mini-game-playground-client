import { motion } from "framer-motion";
import "./styles/Transitions.css";

const GameTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{
        duration: 0.4,
        scale: {
          type: "spring",
          damping: 20,
          stiffness: 100,
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export default GameTransition;
