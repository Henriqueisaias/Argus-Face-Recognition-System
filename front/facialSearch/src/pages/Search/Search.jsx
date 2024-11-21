import { useState, useEffect } from "react";
import Styles from "./Search.module.css";
import axios from "axios";
import Wanted from "../FacialSearch/Wanted";
import { useNavigate } from "react-router-dom";

function Search() {
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [wanted, setWanted] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);


  const handleCpf = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    setCpf(value);
  };


  const cpfSearch = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    setLoading(true);

    try {
      

      const result = await axios.get(`http://localhost:3000/wanted/getOne/${cpf}`);
      
      

      console.log(result)
      

      setWanted(result.data);

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      window.alert("Erro ao buscar dados!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.main}>
    <div className={Styles.container}>
      <h2>Busca por Cpf</h2>

        <div className={Styles.formContainer}>
          <label htmlFor="Cpf">Cpf:</label>
          <input type="text" value={cpf} onChange={handleCpf} />
        </div>


        <button className={Styles.button} onClick={cpfSearch}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {loading && (
        <div className={Styles.loadingcontainer}>
          <div className={Styles.loading}>
            <h2>Buscando...</h2>
          </div>
          <div className={Styles.spinner}></div>
        </div>
      )}

{wanted && (
        <div className={Styles.results}>
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
export default Search
