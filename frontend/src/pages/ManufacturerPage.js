import { useState } from "react";
import { connectContract } from "../utils/contract";
import { QRCodeCanvas } from "qrcode.react";
import { Link } from "react-router-dom";
import {Navigate} from "react-router-dom";

function ManufacturerPage() {

  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    batchNumber: "",
    manufacturingDate: "",
    manufacturerName: "",
    npraRegistrationNumber: ""
  });

  const [qrData, setQrData] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [products, setProducts] =
    useState([]);

  const handleChange = (e) => {

   const upperCaseFields = [
    "productId",
    "batchNumber",
    "npraRegistrationNumber"
  ];

  setFormData({
    ...formData,
    [e.target.name]:
      upperCaseFields.includes(e.target.name)
        ? e.target.value.toUpperCase()
        : e.target.value
  });

};

  const registerProduct = async () => {

    if (
      !formData.productId ||
      !formData.productName ||
      !formData.batchNumber ||
      !formData.manufacturingDate ||
      !formData.manufacturerName ||
      !formData.npraRegistrationNumber
    ) {

      alert("Please fill in all fields.");

      return;
    }

    const npraRegex =
      /^NOT\d{8}[A-Z]$/;

    if (
      !npraRegex.test(
        formData.npraRegistrationNumber
    )
  ) {
    alert(
      "Invalid NPRA format. Example: NOT26050001K"
    );

    return;
  }

    try {

      const contract =
        await connectContract();

      const tx =
        await contract.registerProduct(
          formData.productId,
          formData.productName,
          formData.batchNumber,
          formData.manufacturingDate,
          formData.manufacturerName,
          formData.npraRegistrationNumber
        );

      await tx.wait();

      console.log("Product registered:");

      const qrContent =
        `http://localhost:3000/verify/${formData.productId}/${formData.batchNumber}`;

      setQrData(qrContent);

      setSuccessMessage(
        "✅ Product successfully registered on blockchain."
      );

    } catch (error) {

      console.error(error);

      setQrData("");

      if (error.reason) {

        alert(error.reason);

      } else {

        alert("Registration Failed");
      }
    }
  };

  const loadProducts = async () => {

    console.log("View Products Clicked");
    
    try {

      const contract =
        await connectContract();
      
      console.log(
        typeof contract.getTotalProducts
      );

      const total =
        await contract.getTotalProducts();

      console.log("Total Products:", Number(total));

      const productList = [];

      for (
        let i = 0;
        i < Number(total);
        i++
      ) {

        const product =
          await contract.getProductByIndex(i);

        productList.push(product);
      }

      setProducts(productList);

    } catch (error) {

      console.error(error);

      alert(
        error.message
      );
    }
  };

  const downloadQR = (
  index,
  productId
) => {

  const canvas =
    document.getElementById(
      `qr-${index}`
    );

  const pngUrl =
    canvas
      .toDataURL("image/png")
      .replace(
        "image/png",
        "image/octet-stream"
      );

  const downloadLink =
    document.createElement("a");

  downloadLink.href =
    pngUrl;

  downloadLink.download =
    `${productId}-QR.png`;

  document.body.appendChild(
    downloadLink
  );

  downloadLink.click();

  document.body.removeChild(
    downloadLink
  );
};

const manufacturer =
  JSON.parse(
    localStorage.getItem("manufacturer")
  );

  if (!manufacturer) {
    return <Navigate to="/login" />;
  }

  return (

    <div className="container">

      <div
        className="card shadow-lg p-4 mx-auto"
        style={{
          maxWidth: "700px"
        }}
      >
    <div 
        
        className="d-flex justify-content-end mb-4">

      <Link
        to="/"
        className="btn btn-outline-secondary"
      >
        Back to Home
      </Link>

    </div>

        <h2

          
          className="text-center mb-2"
          style={{
            color: "#E08CA0"
          }}
        >
          
          Manufacturer Dashboard

        </h2>

        <p
          className="text-center text-muted mb-4"
        >
          Register skincare products and generate blockchain verification QR codes.
        </p>

        <div className="mb-3">

          <label className="form-label">
            Product ID
          </label>

          <input
            className="form-control"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
        />

        </div>

        <div className="mb-3">

          <label className="form-label">
            Product Name
          </label>

          <input
            className="form-control"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
          />

        </div>

        <div className="mb-3">

          <label className="form-label">
            Batch Number
          </label>

          <input
            className="form-control"
            name="batchNumber"
            value={formData.batchNumber}
            onChange={handleChange}
        />

        </div>

        <div className="mb-3">

          <label className="form-label">
            Manufacturing Date
          </label>

          <input
            className="form-control"
            type="date"
            name="manufacturingDate"
            value={formData.manufacturingDate}
            onChange={handleChange}
          />

        </div>

        <div className="mb-3">

          <label className="form-label">
            Manufacturer Name
          </label>

          <input
            className="form-control"
            name="manufacturerName"
            value={formData.manufacturerName}
            onChange={handleChange}
          />

        </div>

        <div className="mb-4">

          <label className="form-label">
            NPRA Registration Number
          </label>

          <input
            className="form-control"
            name="npraRegistrationNumber"
            value={formData.npraRegistrationNumber}
            onChange={handleChange}
        />

          <small className="text-muted">
            Format Example: NOT20241234K
          </small>

        </div>

        <button
          className="btn btn-primary w-100"
          onClick={registerProduct}
        >
          Register Product
        </button>

        <button
          className="btn btn-secondary w-100 mt-2"
          onClick={loadProducts}
        >
          View Registered Products
        </button>

      </div>

      {successMessage && (

        <div
          className="alert alert-success mt-4 mx-auto"
          style={{
            maxWidth: "700px"
          }}
        >
          {successMessage}
        </div>

      )}

      {qrData && (

        <div
          className="card shadow-lg mt-4 p-4 mx-auto text-center"
          style={{
            maxWidth: "700px"
          }}
        >

          <h3
            style={{
              color: "#E08CA0"
            }}
          >
            Generated Product QR Code
          </h3>

          <div className="my-3">

            <QRCodeCanvas
              value={qrData}
              size={250}
            />

          </div>

          <p>
            <strong>Product ID:</strong>{" "}
            {formData.productId}
          </p>

          <p>
            <strong>Batch Number:</strong>{" "}
            {formData.batchNumber}
          </p>

          <p>
            <strong>NPRA Registration:</strong>{" "}
            {formData.npraRegistrationNumber}
          </p>

        </div>

      )}

      {products.length > 0 && (

        <div
          className="card shadow-lg mt-4 p-4"
        >

          <h3
            className="mb-4"
            style={{
              color: "#E08CA0"
            }}
          >
            Registered Products
          </h3>

          <table
            className="table table-striped"
          >

            <thead>

              <tr>

                <th>QR Code</th>
                <th>ID</th>
                <th>Name</th>
                <th>Batch</th>
                <th>NPRA</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {products.map(
                (product, index) => (

                  <tr key={index}>

                    <td>

                    <QRCodeCanvas
                      id={`qr-${index}`}
                      value={`http://localhost:3000/verify/${product[0]}/${product[2]}`}
                      size={70}
                    />

                    </td>

                    <td>{product[0]}</td>

                    <td>{product[1]}</td>

                    <td>{product[2]}</td>

                    <td>{product[5]}</td>

                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() =>
                          downloadQR(
                            index,
                            product[0]
                        )
                      }
                      >
                        Download
                      </button>
                    </td>

                    <td></td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );
}

export default ManufacturerPage;