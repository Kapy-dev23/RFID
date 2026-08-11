const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

//Rotas
const userRoutes = require("./routes/userRoutes");

const doorRoutes = require("./routes/doorRoutes");

const roomRoutes = require("./routes/roomRoutes");

const rfidRoutes = require("./routes/rfidRoutes");

const accessLogRoutes = require("./routes/accessLogRoutes");

const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

app.use(cors());//Autoriza pedidos vindos de outro localhost


connectDB();

app.use(express.json());

//User Route
app.use("/api/users", userRoutes);

//Door Route
app.use("/api/doors", doorRoutes);

//Room Route
app.use("/api/rooms", roomRoutes);

//Rfid Route
app.use("/api/rfid", rfidRoutes);

//Access Route
app.use("/api/access", accessLogRoutes);

//Auth Route
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});