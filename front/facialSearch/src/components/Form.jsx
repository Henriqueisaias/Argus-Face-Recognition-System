import styles from "./Form.module.css"
import Wanted from "./Wanted"



function Form() {

    const search = () => {
        
    }


    


    return (
        <div className={styles.main}>
            <div className={styles.form}>
                <button onClick={search()}>Enviar foto</button>
            </div>
            <Wanted wanted={wanted}/>
        </div>
    )
}

export default Form

