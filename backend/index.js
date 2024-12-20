import express from "express";
import UserRoutes from "./routes/UserRoutes.js";
import WantedRoutes from "./routes/WantedRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json());

// Allow CORS
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use("/users", UserRoutes);
app.use("/wanted", WantedRoutes);

const port = 3000;

app.listen(port, () => {
    console.log(`Rodando na porta ${port}`);
});
