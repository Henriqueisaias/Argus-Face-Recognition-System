import { useEffect } from "react";
import styles from "./Wanted.module.css";

function Wanted({ wanted }) {
  useEffect(() => {
    console.log("Dados recebidos no componente Wanted:", wanted);
  }, [wanted]);


  return (
    <>
    {wanted.name && (<div className={styles.container}
      style={{
        marginBottom: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "10px",
      }}
    >
      <div className={styles.resultimg}><img src={wanted.photo} /></div>
      <h3>{wanted.name}</h3>
      <div className="data">
          <p>Idade: {wanted.age}</p>
          <p>Crimes: {wanted.crimes}</p> 
      </div>
      <div>Condenado em: {wanted.condemnd}</div>
    </div>)}

    {wanted.message && (<div className={styles.container}
      style={{
        marginBottom: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "10px",
      }}
    >
        <h2>{wanted.message}</h2>
    </div>)}

    </>);
}


export default Wanted;
