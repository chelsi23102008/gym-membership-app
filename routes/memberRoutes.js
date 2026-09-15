const express = require("express");
const supabase = require("../db");

const router = express.Router();
router.get("/", async (req, res) => {

    try {
        const { data, error } = await supabase
            .from("members")
            .select("*");

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
router.post("/", async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            date_of_birth,
            gender,
            address,
            height,
            weight
        } = req.body;

        const { data, error } = await supabase
            .from("members")
            .insert([
                {
                    first_name,
                    last_name,
                    email,
                    phone,
                    date_of_birth,
                    gender,
                    address,
                    height,
                    weight
                }
            ])
            .select();

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        res.status(201).json(data[0]);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            email,
            phone,
            address,
            weight
        } = req.body;

        const { data, error } = await supabase
            .from("members")
            .update({
                email,
                phone,
                address,
                weight
            })
            .eq("member_id", id)
            .select();

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        if (data.length === 0) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        res.json(data[0]);

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
            .from("members")
            .delete()
            .eq("member_id", id)
            .select();

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        if (data.length === 0) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        res.json({
            message: "Member deleted successfully",
            member: data[0]
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
module.exports = router;