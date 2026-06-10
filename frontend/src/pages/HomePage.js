import {Link} from "react-router-dom";

function HomePage() {

  return (

    <div className="hero-section">

      <div className="hero-content">

        <h1>
          Counterfeit Skincare
          Identification System
        </h1>

        <div className="hero-buttons">

          <Link
            to="/login"
            className="btn btn-light btn-lg"
          >
            Manufacturer Portal
          </Link>

          <Link
            to="/verify"
            className="btn btn-light btn-lg"
          >
            Consumer Verification
          </Link>

        </div>

      </div>

    </div>

  );
}

export default HomePage;