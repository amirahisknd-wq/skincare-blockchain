import { Link } from "react-router-dom";

function HomePage() {
return ( <div className="homepage">

  {/* Navigation Bar */}
  <div className="top-navbar">

    <Link to="/manufacturer">
      MANUFACTURER
    </Link>

    <span>|</span>

    <Link to="/retailer-login">
      RETAILER
    </Link>

    <span>|</span>

    <Link to="/verify">
      CONSUMER
    </Link>
  </div>

  {/* Hero Section */}
  <div className="hero-section">
    <div className="hero-content">

      <h1>
        Counterfeit Skincare
        <br />
        Identification System
      </h1>

    </div>
  </div>

</div>

);
}

export default HomePage;
