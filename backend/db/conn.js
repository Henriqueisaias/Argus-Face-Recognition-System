import mongoose from 'mongoose';

const connect = async () => {
  try {
   
    await mongoose.connect('mongodb://localhost:27017/faces', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conexão feita com sucesso");
  } catch (err) {
    console.log(`Erro ao conectar: ${err}`);
  }
};

export { connect };
