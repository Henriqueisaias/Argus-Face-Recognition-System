import express from "express";
import UserRoutes from "./routes/UserRoutes.mjs";
import WantedRoutes from "./routes/WantedRoutes.mjs";
import cors from "cors";

const app = express();

app.use(express.json());

// Corrigindo a opção de CORS
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use("/users", UserRoutes);
app.use("/wanted", WantedRoutes);

const port = 3000;

app.listen(port, () => {
    console.log(`Rodando na porta ${port}`);
});
