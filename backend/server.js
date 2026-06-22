console.log("Server file started");

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "skincare_system"
});

db.connect((err) => {

  if (err) {
    console.log(err);
    return;
  }

  console.log("MySQL Connected");
});

app.post("/login", (req, res) => {

  const { username, password } =
    req.body;

  db.query(
    `
    SELECT *
    FROM manufacturers
    WHERE username = ?
    AND password = ?
    `,
    [username, password],

    (err, result) => {

      if (err) {

        console.log(err);

        return res.json({
          success: false
        });
      }

      if (result.length > 0) {

        res.json({
          success: true,
          manufacturer:
            result[0]
        });

      } else {

        res.json({
          success: false
        });
      }
    }
  );
});

app.post("/retailer-login", (req, res) => {

    const {
      retailerId,
      password
    } = req.body;

    db.query(
      `
      SELECT *
      FROM retailers
      WHERE retailer_id = ?
      AND password = ?
      `,
      [retailerId, password],

      (err, result) => {

        if (err) {

          console.log(err);

          return res.json({
            success: false
          });

        }

        if (
          result.length > 0
        ) {

          res.json({
            success: true,
            retailer:
              result[0]
          });

        } else {

          res.json({
            success: false
          });

        }

      }
    );

});

app.post( "/report-product", (req, res) => {

    const {
      productId,
      batchNumber,
      reason
    } = req.body;

    db.query(
      `
      INSERT INTO suspicious_reports
      (
        product_id,
        batch_number,
        report_reason
      )
      VALUES (?, ?, ?)
      `,
      [
        productId,
        batchNumber,
        reason
      ],

      (err) => {

        if (err) {

          console.log(err);

          return res.json({
            success: false
          });
        }

        res.json({
          success: true
        });
      }
    );
  }
);

app.post( "/register-retailer", (req, res) => {

    console.log(req.body);
    
    const {
      retailerId,
      retailerName,
      password
    } = req.body;

    db.query(
      `
      INSERT INTO retailers
      (
        retailer_id,
        retailer_name,
        password
      )
      VALUES (?, ?, ?)
      `,
      [
        retailerId,
        retailerName,
        password
      ],

      (err) => {

        if (err) {

          console.log(err);

          return res.json({
            success: false
          });

        }

        res.json({
          success: true
        });

      }
    );

  }
);

app.listen(5000, () => {

  console.log(
    "Server Running on Port 5000"
  );
});