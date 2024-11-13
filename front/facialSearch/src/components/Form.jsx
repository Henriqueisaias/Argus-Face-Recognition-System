import { useState, useEffect } from "react";
import styles from "./Form.module.css";
import Wanted from "./Wanted";
import axios from "axios";
import { useNavigate } from "react-router-dom";

async function req(image, token) {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await axios.post(
      "http://localhost:3000/wanted/search",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Token adicionado aqui
        },
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return { erro: error };
  }
}

function Form() {
  const [image, setImage] = useState(null);
  const [wanted, setWanted] = useState(null);
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
      console.log(imageName)
    }
  };

  const search = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const result = await req(image, token);
    


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
            style={{
              maxHeight: "300px",
              borderRadius: "15px",
              marginBottom: "20px",
            }}
          />
          <p>{imageName}</p>
        </div>
      )}

      {loading && (
        <div className={styles.loadingcontainer}>
          <div className={styles.loading}>
            <h2>Fazendo reconhecimento...</h2>
          </div>
          <div className={styles.spinner}></div>
        </div>
      )}

      {wanted && (
        <div className={styles.results}>
          <h2>Resultados do Reconhecimento</h2>
          {wanted.erro && (
            <div>
              <h2>Ocorreu um erro inesperado: {wanted.erro.message}</h2>
            </div>
          )}
          <Wanted wanted={wanted} />
        </div>
      )}
    </div>
  );
}

export default Form;
