import cv2
import face_recognition
import numpy as np
from pymongo import MongoClient
from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import gridfs
import base64

client = MongoClient("mongodb://localhost:27017/")
db = client["faces"]
fs = gridfs.GridFSBucket(db, bucket_name="uploads")
collection = db["wanteds"]

class FaceRecognitionAPIView(APIView):
    def post(self, request):
        image_base64 = request.data.get('photo')
        if not image_base64:
            return Response({"message": "Imagem não enviada."}, status=status.HTTP_400_BAD_REQUEST)

        image_data = base64.b64decode(image_base64)
        image = np.frombuffer(image_data, dtype=np.uint8)
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        face_locations = face_recognition.face_locations(rgb_image)
        face_encodings = face_recognition.face_encodings(rgb_image, face_locations)

        if len(face_encodings) == 0:
            return Response({"message": "Nenhum rosto encontrado."}, status=status.HTTP_200_OK)

        individuos = collection.find({})
        codificacoes_referencia = []
        dados_individuos = []

        for individuo in individuos:
            imagem_id = individuo['photo']

            try:
                imagem_binaria = fs.open_download_stream(ObjectId(imagem_id)).read()
                imagem_mongo = np.frombuffer(imagem_binaria, dtype=np.uint8)
                imagem_mongo = cv2.imdecode(imagem_mongo, cv2.IMREAD_COLOR)
                imagem_mongo_rgb = cv2.cvtColor(imagem_mongo, cv2.COLOR_BGR2RGB)
                
                
                codificacao = face_recognition.face_encodings(imagem_mongo_rgb)
                if codificacao:
                    codificacoes_referencia.append(codificacao[0])
                    dados_individuos.append(individuo)

            except Exception as e:
                print(f"Erro ao buscar imagem do ID {imagem_id}: {e}")

        
        for face_encoding in face_encodings:
            distancias = face_recognition.face_distance(codificacoes_referencia, face_encoding)
            melhor_correspondencia = np.argmin(distancias)
            if distancias[melhor_correspondencia] < 0.6:
                individuo_correspondente = dados_individuos[melhor_correspondencia]
                return Response({
                    "id": str(individuo_correspondente['_id']),
                }, status=status.HTTP_200_OK)

        return Response({"id": "-1"}, status=status.HTTP_200_OK)




