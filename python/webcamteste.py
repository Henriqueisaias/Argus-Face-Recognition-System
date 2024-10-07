import cv2

# Abrir a webcam (0 normalmente representa a webcam padrão)
video_capture = cv2.VideoCapture(0)

if not video_capture.isOpened():
    print("Não foi possível abrir a webcam.")
else:
    while True:
        ret, frame = video_capture.read()
        if not ret:
            print("Falha ao capturar imagem.")
            break

        # Mostrar a imagem capturada
        cv2.imshow('Video', frame)

        # Sair do loop ao pressionar 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Liberar a captura e fechar janelas
    video_capture.release()
    cv2.destroyAllWindows()
