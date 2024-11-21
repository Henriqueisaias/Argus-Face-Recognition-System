import { useState, useEffect } from "react";
import Styles from "./Insert.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Insert() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [age, setAge] = useState(18);
  const [crime, setCrime] = useState([]);
  const [wanted, setWanted] = useState(false);
  const [cond, setCond] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redireciona para a página de login se o token não estiver presente
    }
  }, [navigate]);

  const clean = () => {
    setName("");
    setAge(18);
    setCrime([]);
    setWanted(false);
    setCond("");
    setImage(null);
    setImageName(null);
  };

  const handleName = (e) => setName(e.target.value);
  const handleAge = (e) => setAge(e.target.value);
  const handleCrime = (e) => setCrime(e.target.value);
  const handleWanted = () => setWanted(!wanted);
  const handleCond = (e) => setCond(e.target.value);
  const handleCpf = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    setCpf(value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
    }
  };

  const insert = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("age", age);
      formData.append("crimes", crime);
      formData.append("wanted", wanted);
      formData.append("condemned", cond);
      formData.append("cpf", cpf);
      formData.append("image", image);

      await axios.post("http://localhost:3000/wanted/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      window.alert("Inserido com sucesso!");
      clean();
    } catch (error) {
      console.error("Erro ao inserir dados:", error);
      window.alert("Erro ao inserir dados!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.container}>
      <h2>Inserir no banco de dados</h2>

      <div className={Styles.fileUpload}>
        <div className={Styles.formContainer}>
          <label htmlFor="name">Nome:</label>
          <input type="text" value={name} onChange={handleName} />
        </div>

        <div className={Styles.formContainer}>
          <label htmlFor="crime">Crimes:</label>
          <input type="text" value={crime} onChange={handleCrime} />
        </div>

        <div className={Styles.formContainer}>
          <label htmlFor="idade">Idade:</label>
          <input type="number" value={age} onChange={handleAge} />
        </div>

        <div className={Styles.formContainer}>
          <label htmlFor="Cpf">Cpf:</label>
          <input type="text" value={cpf} onChange={handleCpf} />
        </div>

        <div className={Styles.formContainer}>
          <label htmlFor="cond">Condenado no ano de:</label>
          <input type="text" value={cond} onChange={handleCond} />
        </div>

        <div className={Styles.checkdiv}>
          <label htmlFor="wanted">Foragido, sim ou não:</label>
          <input
            className={Styles.check}
            type="checkbox"
            checked={wanted}
            onChange={handleWanted}
          />
        </div>

        <label htmlFor="fileInput" className={Styles.button}>
          Selecionar Imagem
        </label>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        <button
          className={Styles.button}
          onClick={insert}
          disabled={!image || loading}
        >
          {loading ? "Inserindo..." : "Inserir"}
        </button>

        {image && (
          <div className={Styles.imagePreview}>
            <h2>Imagem Selecionada:</h2>
            <img
              className="img"
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
      </div>

      {loading && (
        <div className={Styles.loadingcontainer}>
          <div className={Styles.loading}>
            <h2>Fazendo reconhecimento...</h2>
          </div>
          <div className={Styles.spinner}></div>
        </div>
      )}
    </div>
  );
}

export default Insert;
