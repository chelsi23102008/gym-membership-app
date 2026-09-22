const PDFDocument = require("pdfkit");

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
router.get("/member/:member_id", async (req, res) => {
  try {
    const { member_id } = req.params;

    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("membership_id")
      .eq("member_id", member_id)
      .single();

    if (memberError) {
      return res.status(404).json({ error: memberError.message });
    }

    if (!member.membership_id) {
      return res.status(404).json({
        error: "This member has no membership assigned"
      });
    }

    const { data: membership, error: membershipError } = await supabase
      .from("memberships")
      .select("*")
      .eq("membership_id", member.membership_id)
      .single();

    if (membershipError) {
      return res.status(404).json({ error: membershipError.message });
    }

    return res.status(200).json(membership);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:id/access-card", async (req, res) => {
    try {
        const { id } = req.params;

        const { data: membership, error } = await supabase
            .from("memberships")
            .select("*")
            .eq("membership_id", id)
            .single();

        if (error || !membership) {
            return res.status(404).json({
                message: "Membership not found"
            });
        }

        const { data: member, error: memberError } = await supabase
            .from("members")
            .select("*")
            .eq("member_id", membership.member_id)
            .single();

        if (memberError || !member) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        const PDFDocument = require("pdfkit");

        const CARD_WIDTH = 450;
        const CARD_HEIGHT = 180;

        // =========================
        // DATE FORMAT: DD MM YYYY
        // =========================

        const formatDate = (date) => {
            if (!date) return "";

            const [year, month, day] = date.split("-");

            return `${day} ${month} ${year}`;
        };

        const startDate = formatDate(membership.start_date);
        const endDate = formatDate(membership.end_date);

        const doc = new PDFDocument({
            size: [CARD_WIDTH, CARD_HEIGHT],
            margin: 0
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=access-card-${member.member_id}.pdf`
        );

        doc.pipe(res);

        // =========================
        // PREMIUM BACKGROUND
        // =========================

        doc
            .roundedRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 15)
            .fill("#24113F");

        // =========================
        // HEADER
        // =========================

        doc
            .fillColor("#FFFFFF")
            .font("Helvetica-Bold")
            .fontSize(22)
            .text("ASCEND", 0, 15, {
                width: CARD_WIDTH,
                align: "center"
            });

        doc
            .fillColor("#D8C9EA")
            .font("Helvetica")
            .fontSize(9)
            .text("GYM MEMBERSHIP ACCESS CARD", 0, 41, {
                width: CARD_WIDTH,
                align: "center"
            });

        // Divider
        doc
            .moveTo(25, 57)
            .lineTo(425, 57)
            .lineWidth(0.6)
            .strokeColor("#6F4A91")
            .stroke();

        // =========================
        // MEMBER DETAILS
        // =========================

        doc
            .fillColor("#BFAAD8")
            .font("Helvetica")
            .fontSize(11)
            .text(`MEMBER ID: ${member.member_id}`, 25, 67);

        doc
            .fillColor("#FFFFFF")
            .font("Helvetica-Bold")
            .fontSize(16)
            .text(
                `${member.first_name} ${member.last_name}`,
                25,
                83
            );

        // =========================
        // BOTTOM DETAILS
        // =========================

        // Membership ID
        doc
            .fillColor("#BFAAD8")
            .font("Helvetica")
            .fontSize(8.5)
            .text("MEMBERSHIP ID", 25, 119);

        doc
            .fillColor("#FFFFFF")
            .font("Helvetica-Bold")
            .fontSize(13)
            .text(`${membership.membership_id}`, 25, 131);

        // Start Date
        doc
            .fillColor("#BFAAD8")
            .font("Helvetica")
            .fontSize(8.5)
            .text("START DATE", 145, 119);

        doc
            .fillColor("#FFFFFF")
            .font("Helvetica-Bold")
            .fontSize(10.5)
            .text(startDate, 145, 131);

        // End Date
        doc
            .fillColor("#BFAAD8")
            .font("Helvetica")
            .fontSize(8.5)
            .text("END DATE", 245, 119);

        doc
            .fillColor("#FFFFFF")
            .font("Helvetica-Bold")
            .fontSize(10.5)
            .text(endDate, 245, 131);

        // Status
        doc
            .fillColor("#BFAAD8")
            .font("Helvetica")
            .fontSize(8.5)
            .text("STATUS", 350, 119);

        const status = String(membership.status || "").toUpperCase();

        doc
            .fillColor(
                status === "ACTIVE"
                    ? "#B9F6D0"
                    : "#FFB4B4"
            )
            .font("Helvetica-Bold")
            .fontSize(10.5)
            .text(status, 350, 131);

        // =========================
        // FOOTER
        // =========================

        doc
            .fillColor("#BFAAD8")
            .font("Helvetica")
            .fontSize(7.5)
            .text(
                "PRESENT THIS CARD AT THE GYM RECEPTION",
                0,
                164,
                {
                    width: CARD_WIDTH,
                    align: "center"
                }
            );

        doc.end();

    } catch (error) {
        console.error(error);

        if (!res.headersSent) {
            res.status(500).json({
                error: error.message
            });
        }
    }
});
module.exports = router;