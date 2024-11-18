import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/AuthContext.jsx";
import Header from "./components/Header.jsx";
import Login from "./pages/Login/Login.jsx";
import Insert from "./pages/Insert/Insert.jsx";
import Form from "./components/Form.jsx";
import Search from "./pages/Search/Search.jsx"

function App() {
  return (
    
      <AuthProvider>
        <Router>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/insert" element={<Insert />} />
              <Route path="/form" element={<Form />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    
  );
}

export default App;
