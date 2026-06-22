import { useState } from "react";
import { connectContract } from "../utils/contract";
import { Navigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";

function RetailerPage() {

  const [consumerData, setConsumerData] =
    useState({
      productId: "",
      batchNumber: "",
      consumerCode: ""
    });

const [assignedProducts, setAssignedProducts] =
        useState([]);

const [showProducts, setShowProducts] =
    useState(false);

const [isScanning, setIsScanning] =
    useState(false);

const [scanner, setScanner] =
    useState(null);

  const handleChange = (e) => {

    const upperCaseFields = [
        "consumerCode"
    ];

    setConsumerData({
      ...consumerData,
      [e.target.name]: 
      upperCaseFields.includes(e.target.name)
        ? e.target.value.toUpperCase()
        : e.target.value
    });

  };
  const assignConsumer = async () => {

    if (
      !consumerData.productId ||
      !consumerData.batchNumber ||
      !consumerData.consumerCode
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {

      const contract =
        await connectContract();

      const tx =
        await contract.assignConsumer(
          consumerData.productId,
          consumerData.batchNumber,
          consumerData.consumerCode
        );

      await tx.wait();

      alert(
        "Consumer assigned successfully."
        );

      setConsumerData({
        productId: "",
        batchNumber: "",
        consumerCode: ""
      });

    } catch (error) {

      console.error(error);

      alert(
        error.reason ||
        error.shortMessage ||
        "Assignment failed."
      );

    }

  };

  const startScanner = async () => {

    setIsScanning(true);

    setTimeout(async () => {

        try {

            const html5QrCode =
                new Html5Qrcode("retailer-reader");

            setScanner(html5QrCode);

            await html5QrCode.start(

                { facingMode: "environment" },

                {
                    fps: 10,
                    qrbox: 250
                },

                async (decodedText) => {

                    await html5QrCode.stop();

                    setScanner(null);

                    setIsScanning(false);

                    const parts =
                        decodedText.split("/");

                    const productId =
                        parts[parts.length - 2];

                    const batchNumber =
                        parts[parts.length - 1];

                    setConsumerData({
                        ...consumerData,
                        productId,
                        batchNumber
                    });

                }

            );

        } catch (error) {

            console.error(error);

            alert(
                "Camera failed."
            );

        }

    }, 100);

};

const stopScanner = async () => {

    if (scanner) {

        await scanner.stop();

        setScanner(null);

    }

    setIsScanning(false);

};

  const loadProducts = async () => {

    if (showProducts) {

        setShowProducts(false);

        return;

    }

    try {

        const contract =
        await connectContract();

        const total =
        await contract.getTotalProducts();

        const productList = [];

        for (
        let i = 0;
        i < Number(total);
        i++
        ) {

        const product =
            await contract.getProductByIndex(i);

        if (
            product[6] === retailer.retailer_id
        ) {

            productList.push(product);

        }

        }

        setAssignedProducts(
        productList
        );

        setShowProducts(true);

    } catch (error) {

        console.error(error);

    }

    };

    const retailer =
        JSON.parse(
            localStorage.getItem("retailer")
        );

        if (!retailer) {

        return (
            <Navigate
            to="/retailer-login"
            />
        );

  }

    return (

    <div className="container">

        <div
            className="card shadow-lg p-4 mx-auto"
            style={{
            maxWidth: "700px"
            }}
        >

        <div className="d-flex justify-content-end mb-4">

            <button
                className="btn btn-outline-danger"
                onClick={() => {

                localStorage.removeItem(
                    "retailer"
                );

                window.location.href = "/";

                }}
            >
                Logout
            </button>

            </div>

            <h2
                className="text-center mb-2"
                style={{
                    color: "#E08CA0"
                }}
                >
                Retailer Dashboard
                </h2>

                <p
                className="text-center text-muted mb-4"
                >
                Assign product ownership to consumers.
                </p>

            <button
                className="btn btn-success w-100 mb-3"
                onClick={
                    isScanning
                    ? stopScanner
                    : startScanner
                }
            >
                {isScanning
                    ? "Stop Scanner"
                    : "Scan Product QR"}
            </button>

            {isScanning && (

            <div
                id="retailer-reader"
                className="mt-3 mb-3"
            ></div>

            )}

        <div className="mb-3">

          <label>
            Product ID
          </label>

          <input
            className="form-control"
            name="productId"
            readOnly
            value={consumerData.productId}
            onChange={handleChange}
          />

        </div>

        <div className="mb-3">

          <label>
            Batch Number
          </label>

          <input
            className="form-control"
            name="batchNumber"
            readOnly
            value={consumerData.batchNumber}
            onChange={handleChange}
          />

        </div>

        <div className="mb-3">

          <label>
            Consumer Code
          </label>

          <input
            className="form-control"
            name="consumerCode"
            value={consumerData.consumerCode}
            onChange={handleChange}
          />

        </div>

        <button
          className="btn btn-primary w-100"
          onClick={assignConsumer}
        >
          Assign Consumer
        </button>

        <button
            className="btn btn-secondary w-100 mt-2"
            onClick={loadProducts}
            >
            {showProducts
            ? "Hide Assigned Products"
            : "View Assigned Products"}
            </button>

      {showProducts && 
        assignedProducts.length > 0 && (

        <div
            className="card shadow-lg mt-4 p-4"
        >

            <h3
                className="mb-4"
                style={{
                    color: "#E08CA0"
                }}
                >
                Assigned Products
                </h3>

            <table
            className="table table-striped"
            >

            <thead>

                <tr>

                <th>Product ID</th>
                <th>Name</th>
                <th>Batch</th>
                <th>Consumer</th>

                </tr>

            </thead>

            <tbody>

                {assignedProducts.map(
                (product, index) => (

                    <tr key={index}>

                    <td>{product[0]}</td>

                    <td>{product[1]}</td>

                    <td>{product[2]}</td>

                    <td>{product[7]}</td>

                    </tr>

                )
                )}

            </tbody>

            </table>

        </div>

        )}

        </div>

    </div>

  );

}

export default RetailerPage;