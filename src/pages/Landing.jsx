import { Link } from "react-router-dom";
import Transition from "../Transition";
import "./styles/landing.scss";

export function Landing() {

  return (
    <div id="Landing">
        <h2>Te encuentras en el sitio web de</h2>
        <h1>StyleApp</h1>

        <div>
          <Link to="/01">Example 01</Link>
        </div>
    </div>
  );
}

export default Transition(Landing);