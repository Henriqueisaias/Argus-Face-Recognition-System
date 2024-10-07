import express from "express";
import UserRoutes from "./routes/UserRoutes.mjs"
import WantedRoutes from "./routes/WantedRoutes.mjs"

const app = express();

app.use(express.json())
// se der problema de cors ativar essa linha
// app.use(cors({credencials: true, origin: "http://localhost:3000"}))


app.use("/users", UserRoutes)

app.use("/search", WantedRoutes)

const port = 3000;

app.listen(port, ()=>{console.log("rodando na porta 3000")});