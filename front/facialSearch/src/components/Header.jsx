import Styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { useEffect, useContext } from "react";
import { AuthContext } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const { token, logoutToken } = useContext(AuthContext);

  useEffect(() => {}, [token]);

  const deslog = () => {
    logoutToken();
    navigate("/");
  };

  return (
    <>
      {token && (
        <header>
          <h2>Argus</h2>
          <nav>
            <div className={Styles.links}>
              <Link to="/" className={Styles.navLink}>
                Login
              </Link>
              <Link to="/insert" className={Styles.navLink}>
                Cadastrar procurados
              </Link>
              <Link to="/form" className={Styles.navLink}>
                Busca
              </Link>
            </div>
            <div className={Styles.btn}>
              <button onClick={deslog}>deslogar</button>
            </div>
          </nav>
        </header>
      )}

      {!token && (
        <header>
          <h2>Argus</h2>
          <nav>
            <Link to="/" className={Styles.navLink}>
              Login
            </Link>
          </nav>
        </header>
      )}
    </>
  );
}

export default Header;
