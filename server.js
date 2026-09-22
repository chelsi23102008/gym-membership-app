const memberRoutes = require("./routes/memberRoutes");
const planRoutes = require("./routes/planRoutes");
const membershipsRoutes = require("./routes/membershipsRoutes");
const offersRoutes = require("./routes/offersRoutes");

const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/members", memberRoutes);
app.use("/plans", planRoutes);
app.use("/memberships", membershipsRoutes);
app.use("/offers", offersRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});