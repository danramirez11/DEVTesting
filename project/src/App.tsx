import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from "./screens/form";
import "./styles/Layout.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Form/>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
