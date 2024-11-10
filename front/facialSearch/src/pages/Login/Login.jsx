import Styles from "./Login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const clean = () => {
    setUser("");
    setPassword("");
  };

  const handleUser = (e) => {
    setUser(e.target.value);
    console.log(user);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    console.log(password);
  };


const login = async () => {
  const send = { user, password };

  if (user === "" || password === "") {
    return console.log("Por favor, preencha os dados.");
  }

  try {
    const response = await axios.post("URL_DA_API", send);

    // Verifique se o token foi recebido na resposta
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // Armazena o token no localStorage
      console.log("Login bem-sucedido!");
      navigate("/form");
      clean();



      
    
    
    } else {
      console.log("Token não recebido.");
    }
  } catch (error) {
    console.error("Erro no login:", error);
  }
};


  return (
    <div>
      <h2>Login</h2>

      <div className={Styles.container}>
        <div className={Styles.formContainer}>
          <label htmlFor="usuario">Usuário:</label>
          <input type="text" value={user} onChange={handleUser} />
        </div>

        <div className={Styles.formContainer}>
          <label htmlFor="crime">Senha:</label>
          <input type="password" value={password} onChange={handlePassword} />
        </div>

        <button className={Styles.button} onClick={login}>
          Logar
        </button>
      </div>
    </div>
  );
}

export default Login;
