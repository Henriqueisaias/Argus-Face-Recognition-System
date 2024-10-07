const express = require("express");


const app = express();

const port = 3000;

app.use("/", (req, res) => {
    res.send("foi")
})

app.listen(3000, ()=> {

console.log("rodando na porta "+ port)})

