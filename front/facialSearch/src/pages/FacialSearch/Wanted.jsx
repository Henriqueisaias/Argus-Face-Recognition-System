import { useEffect } from "react";
import styles from "./Wanted.module.css";
import PropTypes from "prop-types";

function Wanted({ wanted }) {
  useEffect(() => {
    console.log("Dados recebidos no componente Wanted:", wanted);
  }, [wanted]);

  return (
    <>
      {wanted.name && (
        <div
          className={styles.container}
          style={{
            marginBottom: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          <div className={styles.resultimg}>
            <img src={wanted.photo} />
          </div>
          <h3>{wanted.name}</h3>

          <div className="data">
            <p>CPF: {wanted.cpf}</p>
            <p>Idade: {wanted.age}</p>
            <p>Crimes: {wanted.crimes}</p>
            <p>Condenado em: {wanted.condemned}</p>
          </div>
          {wanted.wanted && <div><p>Foragido</p></div>}
        </div>
      )}

      {wanted.message && (
        <div
          className={styles.container}
          style={{
            marginBottom: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          <h2>{wanted.message}</h2>
        </div>
      )}
    </>
  );
}

Wanted.propTypes = {
  wanted: PropTypes.shape({
    name: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    cpf: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    crimes: PropTypes.string.isRequired,
    condemned: PropTypes.string.isRequired,
    wanted: PropTypes.bool,
    message: PropTypes.string


}
  ).isRequired}


export default Wanted;
