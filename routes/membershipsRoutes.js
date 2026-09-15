const express = require("express");
const supabase = require("../db");

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("memberships")
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
            member_id,
            plan_id,
            start_date,
            end_date,
            fitness_goal,
            additional_services,
            status
        } = req.body;

        const { data, error } = await supabase
            .from("memberships")
            .insert([
                {
                    member_id,
                    plan_id,
                    start_date,
                    end_date,
                    fitness_goal,
                    additional_services,
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
           // member_id,
            //plan_id,
            start_date,
            end_date,
            fitness_goal,
            additional_services
        } = req.body;

        const { data, error } = await supabase
            .from("memberships")
            .update({
               // member_id,
               // plan_id,
                start_date,
                end_date,
                fitness_goal,
                additional_services
            })
            .eq("membership_id", id)
            .select();

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        if (data.length === 0) {
            return res.status(404).json({
                message: "Membership not found"
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
            .from("memberships")
            .update({ status })
            .eq("membership_id", id)
            .select();

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        if (data.length === 0) {
            return res.status(404).json({
                message: "Membership not found"
            });
        }

        res.json(data[0]);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
module.exports = router;