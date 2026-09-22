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
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("offers")
            .delete()
            .eq("offer_id", id)
            .select();

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        if (data.length === 0) {
            return res.status(404).json({
                message: "Offer not found"
            });
        }

        res.json({
            message: "Offer deleted successfully",
            deletedOffer: data[0]
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
module.exports=router;