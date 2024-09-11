import face_recognition
import cv2



def obter_codificacao_referencia(imagem_referencia):

    #colocar aqui o caminho da imagem no mesmo diretorio
    imagem = face_recognition.load_image_file("minha_foto.jpg")
    codificacao = face_recognition.face_encodings(imagem)
    if len(codificacao) > 0:
        return codificacao[0]
    else:
        raise ValueError("Nenhum rosto encontrado na imagem de referência.")



video_capture = cv2.VideoCapture(0)

imagem_referencia = "caminho/para/sua/imagem.jpg"
codificacao_referencia = obter_codificacao_referencia(imagem_referencia)

while True:
    ret, frame = video_capture.read()


    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)


    faces_localizadas = face_recognition.face_locations(rgb_frame)
    codificacoes_faces = face_recognition.face_encodings(rgb_frame, faces_localizadas)

    for (top, right, bottom, left), codificacao_face in zip(faces_localizadas, codificacoes_faces):
        resultados = face_recognition.compare_faces([codificacao_referencia], codificacao_face)

        if resultados[0]:
            texto = "Rosto conhecido!"
        else:
            texto = "Rosto desconhecido!"


        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, texto, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)


    cv2.imshow('Video', frame)


    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


video_capture.release()
cv2.destroyAllWindows()
