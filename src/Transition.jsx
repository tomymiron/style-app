import "./pages/styles/transition.scss";
import { motion } from "framer-motion";

export default function Transition(InnerComponent) {
    return function WrappedComponent(props) {  // Cambia a una función que envuelve el componente original
        return (
            <>
                <InnerComponent {...props} />  {/* Pasa las props al InnerComponent */}
                <motion.div
                    className="slide-in"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 0 }}
                    exit={{ scaleY: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.div
                    className="slide-out"
                    initial={{ scaleY: 1 }}
                    animate={{ scaleY: 0 }}
                    exit={{ scaleY: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
            </>
        );
    };
}
