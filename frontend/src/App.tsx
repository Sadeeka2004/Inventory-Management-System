import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Stores from "./pages/Stores";
import Suppliers from "./pages/Suppliers";
import Categories from "./pages/Categories"; // Added Import
import Products from "./pages/Products";
import StockIn from "./pages/StockIn";
import StockOut from "./pages/StockOut";
import CurrentStock from "./pages/CurrentStock";
import Reports from "./pages/Reports";
import Layout from "./components/layout/Layout";
import InventoryAlerts from "./pages/InventoryAlerts";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/dashboard" />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/stores"
            element={<Stores />}
          />

          <Route
            path="/suppliers"
            element={<Suppliers />}
          />

          {/* Added Categories Router Path */}
          <Route
            path="/categories"
            element={<Categories />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/stock-in"
            element={<StockIn />}
          />

          <Route
            path="/stock-out"
            element={<StockOut />}
          />

          <Route
            path="/current-stock"
            element={<CurrentStock />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/inventory-alerts"
            element={<InventoryAlerts/>}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;