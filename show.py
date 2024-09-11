from pymongo import MongoClient
import gridfs

# Conectar ao MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["faces"]  # Substitua pelo nome do seu banco de dados

def listar_colecoes():
    # Listar todas as coleções no banco de dados
    colecoes = db.list_collection_names()
    print("Coleções no banco de dados:")
    for colecao in colecoes:
        print(f" - {colecao}")

def exibir_documentos(colecao_nome):
    # Exibir documentos de uma coleção específica
    collection = db[colecao_nome]
    documentos = collection.find()
    print(f"Documentos na coleção '{colecao_nome}':")
    for documento in documentos:
        print(documento)
        # Se o documento contiver um file_id, tente recuperar a imagem associada
        if 'foto' in documento:
            try:
                fs = gridfs.GridFS(db)
                file_id = documento['foto']
                imagem_binaria = fs.get(file_id).read()
                print(f"Imagem para {documento['nome']} recuperada com sucesso.")
            except Exception as e:
                print(f"Erro ao recuperar a imagem: {e}")

# Exemplo de uso
listar_colecoes()
colecao_nome = "nome_da_collection"  # Substitua pelo nome da sua coleção
exibir_documentos("wanteds")
