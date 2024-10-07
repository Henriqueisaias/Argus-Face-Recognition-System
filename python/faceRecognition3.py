import cv2
import face_recognition
import numpy as np
import gridfs
from pymongo import MongoClient
from bson import ObjectId

# Conectar ao MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["faces"]
fs = gridfs.GridFS(db)
collection = db["wanted"]

def obter_codificacao_referencia(object_id):
    try:
        # Recuperar imagem do GridFS
        imagem_binaria = fs.get(ObjectId(object_id)).read()
        imagem = np.frombuffer(imagem_binaria, dtype=np.uint8)
        imagem = cv2.imdecode(imagem, cv2.IMREAD_COLOR)

        # Converter imagem de BGR para RGB
        imagem_rgb = cv2.cvtColor(imagem, cv2.COLOR_BGR2RGB)

        # Obter codificação do rosto
        codificacao = face_recognition.face_encodings(imagem_rgb)
        if len(codificacao) > 0:
            return codificacao[0], imagem
        else:
            raise ValueError("Nenhum rosto encontrado na imagem de referência.")
    except Exception as e:
        print(f"Erro ao obter codificação de referência: {e}")
        return None, None

def buscar_individuo_no_mongodb():
    return list(collection.find({}))

def calcular_semelhanca(codificacao_referencia, codificacao_face):
    distancia = face_recognition.face_distance([codificacao_referencia], codificacao_face)[0]
    percentual_semelhanca = (1 - distancia) * 100  # Convertendo a distância em porcentagem de semelhança
    return percentual_semelhanca

def main():
    video_capture = cv2.VideoCapture(0)

    if not video_capture.isOpened():
        print("Não foi possível abrir a webcam.")
        return

    # Definir a resolução da webcam
    video_capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    video_capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    # Buscar todos os indivíduos no MongoDB e carregar suas codificações
    individuos = buscar_individuo_no_mongodb()
    codificacoes_referencia = []
    dados_individuos = []
    imagens_referencia = []

    for individuo in individuos:
        try:
            codificacao, imagem_referencia = obter_codificacao_referencia(individuo["foto"])
            if codificacao is not None:
                codificacoes_referencia.append(codificacao)
                dados_individuos.append(individuo)

                if imagem_referencia is not None:
                    # Redimensionar imagem para um tamanho menor (150x150)
                    imagem_referencia = cv2.resize(imagem_referencia, (150, 150))
                    imagens_referencia.append(imagem_referencia)
        except Exception as e:
            print(f"Erro ao processar {individuo['nome']}: {str(e)}")

    while True:
        ret, frame = video_capture.read()
        if not ret:
            print("Falha ao capturar imagem.")
            break

        # Verificar se o frame não é None
        if frame is not None:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            faces_localizadas = face_recognition.face_locations(rgb_frame)
            codificacoes_faces = face_recognition.face_encodings(rgb_frame, faces_localizadas)

            imagem_reconhecida = None  # Variável para armazenar a imagem do rosto reconhecido

            for (top, right, bottom, left), codificacao_face in zip(faces_localizadas, codificacoes_faces):
                if codificacoes_referencia:
                    distancias = face_recognition.face_distance(codificacoes_referencia, codificacao_face)
                    resultados = distancias <= 0.6

                    if np.any(resultados):
                        match_index = np.argmin(distancias)
                        individuo_correspondente = dados_individuos[match_index]
                        percentual_semelhanca = calcular_semelhanca(codificacoes_referencia[match_index], codificacao_face)
                        print(f"Rosto reconhecido: {individuo_correspondente['nome']}, Idade: {individuo_correspondente['idade']}, Crimes: {individuo_correspondente['crimes']}")
                        print(f"Percentual de semelhança: {percentual_semelhanca:.2f}%")
                        texto = f"Rosto de {individuo_correspondente['nome']}!"

                        # Armazenar a imagem da pessoa reconhecida
                        imagem_reconhecida = imagens_referencia[match_index]
                    else:
                        texto = "Rosto desconhecido!"
                else:
                    texto = "Nenhuma referência encontrada."

                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                cv2.putText(frame, texto, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)

            # Exibir a imagem da pessoa reconhecida no canto superior direito
            if imagem_reconhecida is not None:
                y_offset = 0
                x_offset = frame.shape[1] - imagem_reconhecida.shape[1]  # Posição no canto superior direito
                frame[y_offset:y_offset + imagem_reconhecida.shape[0], x_offset:x_offset + imagem_reconhecida.shape[1]] = imagem_reconhecida

            cv2.imshow('Video', frame)

        else:
            print("O frame está vazio.")

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
