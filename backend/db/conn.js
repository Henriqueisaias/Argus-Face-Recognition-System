const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/faces";

async function main() {

    try{

        await mongoose.connect(uri);
        console.log("conexão on-line");

    }catch(err){
        console.log(err);
    }
}

main();

module.exports = main;
