import React, { useState } from 'react';
import styles from "./Form.module.css"; // Verifique se o caminho está correto
import Wanted from "./Wanted";
import axios from 'axios';

async function req(image) {
    try {
        const formData = new FormData(); // Cria uma nova instância de FormData
        formData.append('image', image); // Adiciona a imagem ao FormData com a chave 'image'

        // Envia a imagem via POST para a rota especificada
        const response = await axios.post('http://localhost:3000/wanted/search/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Configura o cabeçalho para o envio de arquivos
            }
        });

        console.log(response.data);
        return response.data; // Retorna apenas os dados
        
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return []; // Retorna um array vazio em caso de erro
    }
}

function Form() {
    const [image, setImage] = useState(null);
    const [wanted, setWanted] = useState([]); // Armazena os dados retornados
    const [imageName, setImageName] = useState('');
    const [loading, setLoading] = useState(false); // Estado de carregamento

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file); // Armazena o arquivo da imagem em vez da URL temporária
            setImageName(file.name); // Armazena o nome do arquivo
        }
    };

    const search = async () => {
        setLoading(true); // Começa o carregamento
        const result = await req(image); // Chama a função req passando a imagem
        setWanted(result); // Atualiza o estado 'wanted' com os dados recebidos
        setLoading(false); // Termina o carregamento
    };

    return (
        <div className={styles.container}>
            <h1>Sistema de Reconhecimento Facial</h1>

            <div className={styles.fileUpload}>
                <label htmlFor="fileInput" className={styles.button}>Selecionar Imagem</label>
                <input type="file" id="fileInput" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                <button className={styles.button} onClick={search} disabled={!image}>Enviar Imagem</button> {/* Chama a função search */}
            </div>

            {image && (
                <div className={styles.imagePreview}>
                    <h2>Imagem Selecionada:</h2>
                    <img src={URL.createObjectURL(image)} alt={imageName} style={{ maxWidth: '100%', borderRadius: '5px' }} />
                    <p>{imageName}</p>
                </div>
            )}

            <div className={styles.results}>
                <h2>Resultados do Reconhecimento</h2>
                    <Wanted wanted={wanted} />
            </div>
        </div>
    );
}

export default Form;
