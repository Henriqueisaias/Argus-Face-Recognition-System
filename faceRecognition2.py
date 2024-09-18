import cv2
import mediapipe as mp
import numpy as np

# Inicializar MediaPipe FaceMesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, min_detection_confidence=0.7)
face_mesh_realtime = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, min_detection_confidence=0.7)

# Função para extrair landmarks faciais da imagem
def extrair_landmarks(imagem, modo_realtime=False):
    if modo_realtime:
        resultado = face_mesh_realtime.process(cv2.cvtColor(imagem, cv2.COLOR_BGR2RGB))
    else:
        resultado = face_mesh.process(cv2.cvtColor(imagem, cv2.COLOR_BGR2RGB))
    if resultado.multi_face_landmarks:
        return resultado.multi_face_landmarks[0]
    return None

# Função para calcular a distância euclidiana entre dois conjuntos de landmarks
def calcular_distancia(landmarks1, landmarks2):
    if landmarks1 is None or landmarks2 is None:
        return float('inf')  # Retorna uma distância infinita se não houver landmarks
    soma_distancias = 0
    for p1, p2 in zip(landmarks1.landmark, landmarks2.landmark):
        soma_distancias += np.linalg.norm(np.array([p1.x, p1.y]) - np.array([p2.x, p2.y]))
    return soma_distancias / len(landmarks1.landmark)

# Carregar a imagem de referência e extrair landmarks
imagem_referencia = cv2.imread('minha_foto.jpg')
landmarks_referencia = extrair_landmarks(imagem_referencia)

def main():
    # Iniciar a captura de vídeo da webcam
    video_capture = cv2.VideoCapture(0)

    if not video_capture.isOpened():
        print("Não foi possível abrir a webcam.")
        return

    while True:
        # Capturar um frame da webcam
        ret, frame = video_capture.read()
        if not ret:
            print("Falha ao capturar imagem.")
            break

        # Extrair landmarks do rosto no frame atual
        landmarks_frame = extrair_landmarks(frame, modo_realtime=True)

        # Calcular a distância entre os landmarks da imagem de referência e do frame atual
        distancia = calcular_distancia(landmarks_referencia, landmarks_frame)

        # Definir um limiar de distância para considerar se os rostos são semelhantes
        tolerancia = 0.1  # Ajuste o valor conforme necessário
        if distancia < tolerancia:
            texto = f"Rosto correspondente! Distância: {distancia:.4f}"
            print("Rosto reconhecido no terminal! Distância:", distancia)
        else:
            texto = "Rosto não correspondente."
            print("Rosto não reconhecido no terminal.")

        # Exibir a mensagem e os landmarks no frame
        if landmarks_frame:
            for landmark in landmarks_frame.landmark:
                x = int(landmark.x * frame.shape[1])
                y = int(landmark.y * frame.shape[0])
                cv2.circle(frame, (x, y), 1, (0, 255, 0), -1)

        cv2.putText(frame, texto, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
        cv2.imshow('Video', frame)

        # Pressione 'q' para sair
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Liberar a câmera e fechar janelas
    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
