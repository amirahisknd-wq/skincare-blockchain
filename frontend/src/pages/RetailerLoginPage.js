import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function RetailerLoginPage() {

  const [retailerId, setRetailerId] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {

      const response =
        await axios.post(
          "http://localhost:5000/retailer-login",
          {
            retailerId,
            password
          }
        );

      if (
        response.data.success
      ) {

        localStorage.setItem(
          "retailer",
          JSON.stringify(
            response.data.retailer
          )
        );

        navigate("/retailer");

      } else {

        alert(
          "Invalid Username or Password"
        );

      }

    } catch (error) {

      console.error(error);

      alert(
        "Login Failed"
      );

    }

  };

  return (

    <div
      className="card shadow-lg p-5 mx-auto mt-5"
      style={{
        maxWidth: "500px",
        borderRadius: "20px"
      }}
    >

      <div className="text-end mb-3">

        <Link
          to="/"
          className="btn btn-outline-secondary"
        >
          Back to Home
        </Link>

      </div>

      <h2
        className="text-center mb-4"
        style={{
          color: "#E08CA0"
        }}
      >
        Retailer Login
      </h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Retailer ID"
        value={retailerId}
        onChange={(e) =>
          setRetailerId(
            e.target.value.toUpperCase()
          )
        }
      />

      <input
        type="password"
        className="form-control mb-4"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      <button
        className="btn btn-primary"
        onClick={handleLogin}
      >
        Login
      </button>

    </div>

  );

}

export default RetailerLoginPage;