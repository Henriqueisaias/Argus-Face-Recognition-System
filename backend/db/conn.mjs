import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function connect() {
    try{
        await client.connect();
        console.log("conexão feita com sucesso");
        const db = client.db("faces");
        return db;
    }catch(err){console.log(`erro ao conectar${err}`)}
}

export {connect, client}