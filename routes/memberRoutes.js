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
            weight,
            membership_id
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
                    weight,
                    membership_id
                }
            ])
            .select()
            .single();
        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        res.status(201).json(data);

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
            weight,
            height
        } = req.body;

        const { data, error } = await supabase
            .from("members")
            .update({
                email,
                phone,
                address,
                weight,
                height
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
router.patch("/:member_id/membership", async (req, res) => {
  try {
    const { member_id } = req.params;
    const { membership_id } = req.body;

    const { data, error } = await supabase
      .from("members")
      .update({ membership_id })
      .eq("member_id", member_id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
});
module.exports = router;