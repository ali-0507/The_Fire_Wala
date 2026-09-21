const express = require('express');
const {Pool} = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

//middleware
app.use(cors({
  origin: [
    "https://the-fire-wala.vercel.app"
  ]
}));
app.use(express.json());

//PostgreSQL connection
console.log("DB_PASSWORD loaded:", typeof process.env.DB_PASSWORD);

const pool = new Pool({
    host:process.env.DB_HOST,
    port:Number(process.env.DB_PORT),
    database:process.env.DB_NAME,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: true }
});

//Testing DB connection

pool.query("SELECT NOW()")
.then((result)=>{
    console.log("Database connected!!");
    console.log("Database Time:", result.rows[0].now);
})
.catch((error)=>{
    console.error("Database connection error:",error.message);
});

//Basic API route
app.get("/", (req, res) => {
  res.send("The Fire Wala backend is running!");
});


/* POST API: Save customer service request */

app.post("/api/service-requests", async (req, res) => {
  try {
    const {
      client_name,
      phone,
      email,
      company_name,
      service_type,
      additional_details,
      extinguisher_quantity
    } = req.body;

    // 1. Validate required fields
    if (
      !client_name?.trim() ||
      !phone?.trim() ||
      !service_type?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and service type are required."
      });
    }

    // 2. Validate quantity if provided
    let quantity = null;

    if (
      extinguisher_quantity !== undefined &&
      extinguisher_quantity !== null &&
      extinguisher_quantity !== ""
    ) {
      quantity = Number(extinguisher_quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a positive whole number."
        });
      }
    }

    // 3. Insert data into PostgreSQL
    const query = `
      INSERT INTO service_request (
        client_name,
        phone,
        email,
        company_name,
        service_type,
        additional_details,
        extinguisher_quantity
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, status, created_at
    `;

    const values = [
      client_name.trim(),
      phone.trim(),
      email?.trim() || null,
      company_name?.trim() || null,
      service_type.trim(),
      additional_details?.trim() || null,
      quantity
    ];

    const result = await pool.query(query, values);

    // 4. Send success response
    return res.status(201).json({
      success: true,
      message: "Service request saved successfully!",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error saving service request:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save service request."
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});