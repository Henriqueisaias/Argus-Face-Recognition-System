import { Link } from "react-router-dom";
import Styles from "./Header.module.css";


function Header({token}) {

  console.log(token)
  

  return (
    <>
    {token && (<header>
      <h2>Argus</h2>
      <nav>
        <Link to="/" className={Styles.navLink}>
          Login
        </Link>
        <Link to="/insert" className={Styles.navLink}>
          Cadastrar procurados
        </Link>
        <Link to="/form" className={Styles.navLink}>
          Busca
        </Link>
      </nav>
    </header>)}

    {!token && (<header>
      <h2>Argus</h2>
      <nav>
        <Link to="/" className={Styles.navLink}>
          Login
        </Link>
      </nav>
    </header>)}

    </>
  );
}

export default Header;
