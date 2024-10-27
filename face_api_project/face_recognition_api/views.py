import cv2
import face_recognition
import numpy as np
from pymongo import MongoClient
from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import gridfs

client = MongoClient("mongodb://localhost:27017/")
db = client["faces"]
fs = gridfs.GridFS(db)
collection = db["wanted"]

class FaceRecognitionAPIView(APIView):
    def post(self, request):
        # Carregar a imagem enviada na requisição
        image_file = request.FILES['image']
        image = np.frombuffer(image_file.read(), dtype=np.uint8)
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Encontrar rostos na imagem enviada
        face_locations = face_recognition.face_locations(rgb_image)
        face_encodings = face_recognition.face_encodings(rgb_image, face_locations)

        if len(face_encodings) == 0:
            return Response({"message": "Nenhum rosto encontrado."}, status=status.HTTP_400_BAD_REQUEST)

        # Buscar todos os indivíduos no MongoDB
        individuos = collection.find({})
        codificacoes_referencia = []
        dados_individuos = []

        for individuo in individuos:
            imagem_id = individuo['foto']
            imagem_binaria = fs.get(ObjectId(imagem_id)).read()
            imagem_mongo = np.frombuffer(imagem_binaria, dtype=np.uint8)
            imagem_mongo = cv2.imdecode(imagem_mongo, cv2.IMREAD_COLOR)
            imagem_mongo_rgb = cv2.cvtColor(imagem_mongo, cv2.COLOR_BGR2RGB)
            codificacao = face_recognition.face_encodings(imagem_mongo_rgb)

            if codificacao:
                codificacoes_referencia.append(codificacao[0])
                dados_individuos.append(individuo)

        # Comparar os rostos encontrados com os da base de dados
        for face_encoding in face_encodings:
            distancias = face_recognition.face_distance(codificacoes_referencia, face_encoding)
            melhor_correspondencia = np.argmin(distancias)
            if distancias[melhor_correspondencia] < 0.6:
                individuo_correspondente = dados_individuos[melhor_correspondencia]
                return Response({
                    "id": str(individuo_correspondente['_id']),
                    "nome": individuo_correspondente['nome'],
                    "idade": individuo_correspondente['idade'],
                    "crimes": individuo_correspondente['crimes']
                }, status=status.HTTP_200_OK)

        return Response({"message": "Rosto não encontrado."}, status=status.HTTP_404_NOT_FOUND)
