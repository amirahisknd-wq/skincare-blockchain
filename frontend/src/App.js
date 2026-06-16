import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";
import ManufacturerPage from "./pages/ManufacturerPage";
import ConsumerPage from "./pages/ConsumerPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RetailerPage from "./pages/RetailerPage";
import RetailerLoginPage from "./pages/RetailerLoginPage";

console.log("LoginPage => ", LoginPage);

function App() {

  return (

    <BrowserRouter>

      <div className="container mt-4">

        <Routes>

          <Route
          path="/"
          element={<HomePage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/manufacturer"
            element={<ManufacturerPage />}
          />

          <Route
            path="/retailer-login"
            element={<RetailerLoginPage />}
          />

          <Route
            path="/retailer"
            element={<RetailerPage />}
          />

          <Route
            path="/verify"
            element={<ConsumerPage />}
          />

          <Route
            path="/verify/:productId/:batchNumber"
            element={<ConsumerPage />}
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;