import React, { useState } from 'react';
import styles from "./Form.module.css"; // Verifique se o caminho está correto
import Wanted from "./Wanted";

function Form() {
    const [image, setImage] = useState(null);
    const [wanted, setWanted] = useState(false);
    const [imageName, setImageName] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file)); // Cria uma URL temporária para visualizar a imagem
            setImageName(file.name); // Armazena o nome do arquivo
        }
    };

    const search = () => {
        // Aqui você pode implementar a lógica para o reconhecimento facial.
        // Vamos simular que encontramos um resultado
        setWanted(true);
    };

    return (
        <div className={styles.container}>
            <h1>Sistema de Reconhecimento Facial</h1>

            <div className={styles.fileUpload}>
                <label htmlFor="fileInput" className={styles.button}>Selecionar Imagem</label>
                <input type="file" id="fileInput" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                <button className={styles.button} onClick={search} disabled={!image}>Enviar Imagem</button>
            </div>

            {image && (
                <div className={styles.imagePreview}>
                    <h2>Imagem Selecionada:</h2>
                    <img src={image} alt={imageName} style={{ maxWidth: '100%', borderRadius: '5px' }} />
                    <p>{imageName}</p>
                </div>
            )}

            <div className={styles.results}>
                <h2>Resultados do Reconhecimento</h2>
                {wanted ? (
                    <>
                        <p><strong>ID da Pessoa:</strong> 12345</p>
                        <p><strong>Nome:</strong> João da Silva</p>
                    </>
                ) : (
                    <p>Aguardando envio da imagem...</p>
                )}
            </div>

            <Wanted wanted={wanted} />
        </div>
    );
}

export default Form;
