import { Route, Routes } from "react-router-dom";
import "./styles/App.css";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
