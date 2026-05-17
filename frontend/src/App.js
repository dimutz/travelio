import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Properties from "./pages/Properties";
import CreateProperty from "./pages/CreateProperty";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import Profile from "./pages/Profile"
import PropertyDetails from "./pages/PropertyDetails";
import OwnerPropertyRooms from "./pages/OwnerPropertyRooms";
import OwnerPropertyReceptionist from "./pages/OwnerPropertyReceptionist";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute>
              <SignIn />
            </AuthRoute>
          }
        />

        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <Properties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-property"
          element={
            <ProtectedRoute>
              <CreateProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/property/:id" 
          element={
            <ProtectedRoute>
              <PropertyDetails />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/owner/properties/:propertyId/rooms"
          element={
            <ProtectedRoute>
              <OwnerPropertyRooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/properties/:propertyId/receptionist"
          element={
            <ProtectedRoute>
              <OwnerPropertyReceptionist />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
