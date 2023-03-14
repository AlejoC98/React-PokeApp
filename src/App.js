import { Route, Routes } from "react-router-dom";
import Dashboard from "./views/dashboard";
import Login from "./views/auth/Login";
import SignIn from "./views/auth/SignIn";
import Recovery from "./views/auth/Recovery";
import { AuthLayout, AppLayaout } from "./views/global/Layaout";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={
            <ProtectedRoute>
              <AppLayaout/>
            </ProtectedRoute>
        }>
          <Route index path="/Dashboard" element={<Dashboard />}/>
        </Route>
        <Route path="/" element={
          <ProtectedRoute>
            <AuthLayout/>
          </ProtectedRoute>
        }>
          <Route index path="/Login" element={<Login />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/Recovery" element={<Recovery />} />
        </Route>
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
