import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import ComponentsShowcase from "./components/ComponentsShowcase";
import "./styles/Layout.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-layout">
              <Navigation />
              <div className="app-content">
                <ComponentsShowcase />
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
