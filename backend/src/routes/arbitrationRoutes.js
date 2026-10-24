const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * @route POST /api/arbitration/dispute/file
 * @desc File a new private dispute between parties
 */
router.post("/dispute/file", async (req, res) => {
    try {
        const { disputeIdentifier, claimantHash, respondentHash, arbitratorAddress, caseDetails } = req.body;
        
        if (!disputeIdentifier || !claimantHash || !respondentHash || !arbitratorAddress) {
            return res.status(400).json({ success: false, error: "Missing required dispute parameters" });
        }

        const query = `
            INSERT INTO disputes (dispute_identifier, claimant_hash, respondent_hash, arbitrator_address, case_details, status)
            VALUES ($1, $2, $3, $4, $5, 'Pending-Review') RETURNING *;
        `;
        const values = [disputeIdentifier, claimantHash, respondentHash, arbitratorAddress, caseDetails];
        const result = await db.query(query, values);

        res.status(201).json({ success: true, dispute: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route POST /api/arbitration/verdict
 * @desc Record a binding arbitrator verdict and close the dispute case
 */
router.post("/verdict", async (req, res) => {
    try {
        const { disputeId, arbitratorAddress, verdictSummary } = req.body;

        const query = `
            UPDATE disputes 
            SET verdict_summary = $1, status = 'Resolved', resolved_at = CURRENT_TIMESTAMP
            WHERE id = $2 AND arbitrator_address = $3 RETURNING *;
        `;
        const values = [verdictSummary, disputeId, arbitratorAddress];
        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return res.status(403).json({ success: false, error: "Unauthorized or invalid dispute ID" });
        }

        res.status(200).json({ success: true, resolvedCase: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
