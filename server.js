const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);


app.get("/members", async (req, res) => {
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
app.post("/members", async (req, res) => {
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
app.put("/members/:id", async (req, res) => {
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
app.delete("/members/:id", async (req, res) => {
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
app.get("/plans", async (req, res) => {
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
app.post("/plans", async (req, res) => {
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
app.put("/plans/:id", async (req, res) => {
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
app.patch("/plans/:id/status", async (req, res) => {
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
app.delete("/plans/:id", async (req, res) => {
    try {
        const { id } = req.params;

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
app.get("/memberships", async (req, res) => {
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
app.post("/memberships", async (req, res) => {
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
app.put("/memberships/:id", async (req, res) => {
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
app.patch("/memberships/:id/status", async (req, res) => {
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
// app.delete("/memberships/:id", async (req, res) => {
//     try {
//         const { id } = req.params;

//         const { data, error } = await supabase
//             .from("memberships")
//             .delete()
//             .eq("membership_id", id)
//             .select();

//         if (error) {
//             return res.status(500).json({
//                 error: error.message
//             });
//         }

//         if (data.length === 0) {
//             return res.status(404).json({
//                 message: "Membership not found"
//             });
//         }

//         res.json({
//             message: "Membership deleted successfully",
//             membership: data[0]
//         });

//     } catch (error) {
//         res.status(500).json({
//             error: error.message
//         });
//     }
// });
app.get("/offers", async (req, res) => {
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
const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});