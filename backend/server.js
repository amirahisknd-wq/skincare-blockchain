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

app.post(
  "/report-product",
  (req, res) => {

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

app.post(
  "/log-verification",
  (req, res) => {

    const {
      productId,
      batchNumber
    } = req.body;

    db.query(
      `
      INSERT INTO verification_logs
      (
        product_id,
        batch_number
      )
      VALUES (?, ?)
      `,
      [
        productId,
        batchNumber
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

app.get(
  "/verification-count/:productId/:batchNumber",
  (req, res) => {

    const {
      productId,
      batchNumber
    } = req.params;

    db.query(
      `
      SELECT COUNT(*) AS total
      FROM verification_logs
      WHERE product_id = ?
      AND batch_number = ?
      `,
      [
        productId,
        batchNumber
      ],
      (err, result) => {

        if (err) {

          console.log(err);

          return res.json({
            success: false
          });
        }

        res.json({
          success: true,
          count: result[0].total
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