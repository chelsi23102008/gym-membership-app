const express = require("express");
const supabase = require("../db");

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("offers")
            .select("*")
            .eq("status", "Active");

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
module.exports=router;