import { Route, Routes } from "react-router-dom";
import Dashboard from "./views/dashboard";
import Login from "./views/auth/Login";
import SignIn from "./views/auth/SignIn";
import Recovery from "./views/auth/Recovery";
import Game from "./views/game";
import { AuthLayout, AppLayaout } from "./views/global/Layaout";
import { AuthContextProvider } from "./context/AuthContext";
import { ProtectedRoute, ProtectedLoggedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayaout/>
          </ProtectedRoute>
          }>
          <Route path="/Dashboard" element={<Dashboard />}/>
          <Route path="/Game" element={<Game />}/>
        </Route>
        <Route path="/" element={
          <ProtectedLoggedRoute>
            <AuthLayout/>
          </ProtectedLoggedRoute>
        }>
          <Route index path="Login" element={ <Login />}/>
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/Recovery" element={<Recovery />} />
        </Route>
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
