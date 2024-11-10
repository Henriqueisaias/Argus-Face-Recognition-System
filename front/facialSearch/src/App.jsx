import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Header from './components/Header.jsx';
import Login from './pages/Login/Login.jsx';
import Insert from './pages/Insert/Insert.jsx';
import Form from './components/Form.jsx';
import './App.css';

function App() {

 const [token, setToken] = useState(false)

useEffect(()=>{
  setToken(localStorage.getItem("token"))
},[])



  return (
    <Router>
      <Header token={token}/>
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/insert" element={<Insert />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
