import React, { useState } from "react";
import styles from "./Form.module.css";
import Wanted from "./Wanted";
import axios from "axios";

async function req(image) {
  try {
    const formData = new FormData(); 
    formData.append("image", image); 

    
    const response = await axios.post(
      "http://localhost:3000/wanted/search/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      }
    );

    console.log(response.data);
    return response.data; 
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return [];
  }
}

function Form() {
  const [image, setImage] = useState(null);
  const [wanted, setWanted] = useState(null);
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
    }
  };

  const search = async () => {
    setLoading(true);
    const result = await req(image);
    setWanted(result); 
    setLoading(false); 
  };

  return (
    <div className={styles.container}>
      <h2>Busca por reconhecimento facial</h2>

      <div className={styles.fileUpload}>
        <label htmlFor="fileInput" className={styles.button}>
          Selecionar Imagem
        </label>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <button className={styles.button} onClick={search} disabled={!image}>
          Buscar Pessoa
        </button>{" "}
      
      </div>

      {image && (
        <div className={styles.imagePreview}>
          <h2>Imagem Selecionada:</h2>
          <img
            src={URL.createObjectURL(image)}
            alt={imageName}
            style={{ maxHeight: "300px", borderRadius: "15px" }}
          />
          <p>{imageName}</p>
        </div>
      )}

      {wanted && (
        <div className={styles.results}>
          <h2>Resultados do Reconhecimento</h2>
          <Wanted wanted={wanted} />
        </div>
      )}

    </div>
  );
}

export default Form;
