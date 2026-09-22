const express = require("express");
const supabase = require("../db");

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("plans")
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
            plan_name,
            duration,
            price,
            description,
            status
        } = req.body;

        const { data, error } = await supabase
            .from("plans")
            .insert([
                {
                    plan_name,
                    duration,
                    price,
                    description,
                    status
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
            plan_name,
            duration,
            price,
            description
        } = req.body;

        const { data, error } = await supabase
            .from("plans")
            .update({
                plan_name,
                duration,
                price,
                description
            })
            .eq("plan_id", id)
            .select();

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        if (data.length === 0) {
            return res.status(404).json({
                message: "Plan not found"
            });
        }

        res.json(data[0]);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
router.patch("/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from("plans")
            .update({ status })
            .eq("plan_id", id)
            .select();

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        if (data.length === 0) {
            return res.status(404).json({
                message: "Plan not found"
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

        const { data: memberships, error: membershipError } = await supabase
            .from("memberships")
            .select("membership_id")
            .eq("plan_id", id);

        if (membershipError) {
            return res.status(500).json({
                error: membershipError.message
            });
        }
        if (memberships.length > 0) {
            const { data, error } = await supabase
                .from("plans")
                .update({ status: "Inactive" })
                .eq("plan_id", id)
                .select();

            if (error) {
                return res.status(500).json({
                    error: error.message
                });
            }

            return res.json({
                message: "Plan is assigned to memberships, so it was deactivated.",
                plan: data[0]
            });
        }

        const { data, error } = await supabase
            .from("plans")
            .delete()
            .eq("plan_id", id)
            .select();

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        if (data.length === 0) {
            return res.status(404).json({
                message: "Plan not found"
            });
        }

        res.json({
            message: "Plan deleted successfully",
            plan: data[0]
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
module.exports = router;