const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sendToGoogleSheets = require("./googleSheets");

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "The Fire Wala AMC backend is running"
    });
});

//database test route

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            success: true,
            message: "PostgreSQL connected successfully",
            databaseTime: result.rows[0].now
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

//entering values in leads table route
app.post("/api/leads", async (req, res) => {

    try {

        const {
            name,
            phone,
            email,
            company,
            location,
            service_type,
            source
        } = req.body;

        // VALIDATION

        if (!name || !phone || !email || !service_type) {

            return res.status(400).json({
                success: false,
                message: "Name, phone, email and service type are required."
            });

        }
        // GENERATE LEAD ID

        const leadId = `AMC-${Date.now()}`;
        // INSERT INTO POSTGRESQL

        const query = `
            INSERT INTO leads
            (
                lead_id,
                name,
                phone,
                email,
                company,
                location,
                service_type,
                source
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;


        const values = [
            leadId,
            name,
            phone,
            email,
            company || null,
            location || null,
            service_type,
            source || "unknown"
        ];


        const result = await pool.query(query, values);

        const savedLead = result.rows[0];

        // SEND RESPONSE TO CLIENT

        res.status(201).json({
            success: true,
            message: "Lead submitted successfully.",
            leadId: savedLead.lead_id
        });
   
     // GOOGLE SHEETS SYNC

        await sendToGoogleSheets(savedLead);

    } catch (error) {

        console.error("Error saving lead:", error);

        res.status(500).json({
            success: false,
            message: "Unable to save lead."
        });

    }

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});