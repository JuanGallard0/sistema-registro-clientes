import Layout from "./components/layout/Layout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistroClientes from "./views/RegistroClientes";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<RegistroClientes />}></Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
