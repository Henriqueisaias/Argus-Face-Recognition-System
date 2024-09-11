from pymongo import MongoClient
import gridfs
from bson import ObjectId

# Conectar ao MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["faces"]

# Criar GridFS para armazenar imagens
fs = gridfs.GridFS(db)

# Abrir a imagem e armazená-la no GridFS
with open("minha_foto.jpg", "rb") as imagem_file:
    imagem_id = fs.put(imagem_file, filename="minha_foto.jpg")

# Criar o documento para inserir na collection 'wanted'
documento = {
    "nome": "caio",
    "idade": 30,
    "crimes": ["andar com sorvete no bolso aos domingos"],
    "foto": ObjectId(imagem_id)  # Referência ao _id da imagem no GridFS
}

# Inserir o documento na collection 'wanted'
collection = db["wanted"]
result = collection.insert_one(documento)

print(f"Documento inserido com ID: {result.inserted_id}")
print(f"Imagem salva com ID: {imagem_id}")