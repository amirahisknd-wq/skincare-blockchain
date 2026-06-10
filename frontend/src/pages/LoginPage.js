import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {

      const response =
        await axios.post(
          "http://localhost:5000/login",
          {
            username,
            password
          }
        );

      if (
        response.data.success
      ) {

        localStorage.setItem(
          "manufacturer",
          JSON.stringify(
            response.data.manufacturer
          )
        );

        navigate("/manufacturer");

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
        Manufacturer Login
      </h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(
            e.target.value
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

export default LoginPage;