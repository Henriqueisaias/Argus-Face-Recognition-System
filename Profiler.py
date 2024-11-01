import face_recognition
import numpy as np
import gridfs
import cv2
from pymongo import MongoClient
from bson import ObjectId
import unicodedata

client = MongoClient("mongodb://localhost:27017/")
db = client["faces"]
fs = gridfs.GridFS(db)
collection = db["wanted"]

def normalize_text(text):
    """Normaliza o texto para remover caracteres especiais."""
    return unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')

def obter_encoding_referencia(object_id):
    try:
        imagem_binaria = fs.get(ObjectId(object_id)).read()
        imagem = np.frombuffer(imagem_binaria, dtype=np.uint8)
        imagem = cv2.imdecode(imagem, cv2.IMREAD_COLOR)

        encodings = face_recognition.face_encodings(imagem)
        if encodings:
            return encodings[0]
    except Exception as e:
        print(f"Erro ao obter encoding de referência: {e}")
    return None

def buscar_individuos_no_mongodb():
    return list(collection.find({}))

def main():
    video_capture = cv2.VideoCapture(0)
    if not video_capture.isOpened():
        print("Não foi possível abrir a webcam.")
        return

    individuos = buscar_individuos_no_mongodb()
    encodings_referencia = []
    dados_individuos = []

    for individuo in individuos:
        encoding = obter_encoding_referencia(individuo["foto"])
        if encoding is not None:
            encodings_referencia.append(encoding)
            dados_individuos.append(individuo)

    while True:
        ret, frame = video_capture.read()
        if not ret:
            print("Falha ao capturar imagem.")
            break

        rostos_encontrados = face_recognition.face_locations(frame)
        encodings_frame = face_recognition.face_encodings(frame, rostos_encontrados)

        for (top, right, bottom, left), encoding_frame in zip(rostos_encontrados, encodings_frame):
            rosto_reconhecido = False
            nome = ""
            idade = ""
            crimes = []
            condenado_em = ""
            foragido = False

            for encoding_referencia, individuo in zip(encodings_referencia, dados_individuos):
                distancia = face_recognition.face_distance([encoding_referencia], encoding_frame)[0]

                if distancia < 0.6:
                    nome = normalize_text(individuo['nome']).upper()
                    idade = individuo['idade']
                    crimes = individuo.get('crimes', [])
                    condenado_em = individuo.get('condenado_em', "")
                    foragido = individuo.get('foragido', False)
                    rosto_reconhecido = True
                    break

            cv2.rectangle(frame, (left, top), (right, bottom), (255, 255, 255), 1)

            if rosto_reconhecido:
                info_height = 80 + (len(crimes) * 20) + (20 if condenado_em else 0) + (20 if foragido else 0)
                cv2.rectangle(frame, (right + 10, top), (right + 210, top + info_height), (0, 0, 0), -1)

                cv2.rectangle(frame, (right + 10, top), (right + 210, top + 30), (255, 255, 255), -1)
                cv2.putText(frame, nome, (right + 15, top + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 1)

                cv2.putText(frame, f"IDADE: {idade}", (right + 15, top + 50), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                            (255, 255, 255), 1)

                if condenado_em:
                    cv2.putText(frame, f"CONDENADO EM: {condenado_em}", (right + 15, top + 70), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                                (255, 255, 255), 1)

                if foragido:
                    cv2.putText(frame, "FORAGIDO: SIM", (right + 15, top + 90), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                                (0, 0, 255), 1)
                else:
                    cv2.putText(frame, "FORAGIDO: NÃO", (right + 15, top + 90), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                                (0, 255, 0), 1)

                y_offset = top + 110
                for crime in crimes:
                    cv2.putText(frame, f"CRIMES: {crime}", (right + 15, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                                (255, 255, 255), 1)
                    y_offset += 20
            else:
                unknown_label_height = 20
                unknown_label_top = bottom
                unknown_label_bottom = unknown_label_top + unknown_label_height
                cv2.rectangle(frame, (left, unknown_label_top), (right, unknown_label_bottom), (255, 255, 255), -1)
                cv2.putText(frame, "DESCONHECIDO", (left + 5, unknown_label_top + 12), cv2.FONT_HERSHEY_SIMPLEX, 0.3,
                            (0, 0, 0), 0)

        cv2.imshow('Video', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
