require("dotenv").config();
async function sendToGoogleSheets(lead) {
    try {
        const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(lead)
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(
                result.message || "Google Sheets sync failed"
            );
        }
        console.log("Lead successfully synced to Google Sheets");
        return true;
    } catch (error) {
        console.error(
            "Google Sheets sync error:",
            error.message
        );

        return false;
    }
}
module.exports = sendToGoogleSheets;