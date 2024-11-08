import { useState } from "react";
import Styles from "./Insert.module.css";

function Insert() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(18);
  const [crime, setCrime] = useState([]);
  const [wanted, setWanted] = useState(false);
  const [cond, setCond] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);

  const [loading, setLoading] = useState(false);

  const clean = () => {
    setName("");
    setAge(18);
    setCrime([]);
    setWanted(false);
    setCond("");
    setImage(null);
  };

  const handleName = (e) => {
    setName(e.target.value);
    console.log(name);
  };

  const handleAge = (e) => {
    setAge(e.target.value);
    console.log(age);
  };

  const handleCrime = (e) => {
    setCrime(e.target.value);
    console.log(crime);
  };

  const handleWanted = () => {
    setWanted(!wanted);
    console.log(wanted);
  };

  const handleCond = (e) => {
    setCond(e.target.value);
    console.log(cond);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
    }
  };

  function insert() {
    const person = {
      name: name,
      age: age,
      crime: crime,
      wanted: wanted,
      cond: cond,
      image: image,
    };

    
    console.log(person);
    setLoading(true)
    window.alert("inserido com sucesso!");
    setLoading(false)
    clean();
    // requisição de post vai aqui
  }

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
          <label htmlFor="cond">Condenano no ano de:</label>
          <input type="text" value={cond} onChange={handleCond} />
        </div>

        <div className={Styles.checkdiv}>
          <label htmlFor="cond">Foragido, sim ou não:</label>
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

        <button className={Styles.button} onClick={insert} disabled={!image}>
          Inserir
        </button>
      </div>

      {image && (
        <div className={Styles.imagePreview}>
          <h2>Imagem Selecionada:</h2>
          <img
            className={"img"}
            src={URL.createObjectURL(image)}
            // alt={imageName}
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
        <div className={Styles.loadingcontainer}>
        <div className={Styles.loading}><h2>Fazendo reconhecimento...</h2></div>
        <div className={Styles.spinner}></div>
        </div>
      )}

    </div>
  );
}

export default Insert;
