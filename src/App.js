import { Route, Routes } from "react-router-dom";
import Dashboard from "./views/dashboard";
import Login from "./views/auth/Login";
import SignIn from "./views/auth/SignIn";
import Recovery from "./views/auth/Recovery";
import CardSet from "./views/cardsets";
import SetDescription from "./views/cardsets/setdescription";
import CardDescription from "./views/cardsets/carddescription";
import Game from "./views/game";
import { AuthLayout, AppLayaout } from "./views/global/Layaout";
import { AuthContextProvider } from "./context/AuthContext";
import { ProtectedRoute, ProtectedLoggedRoute } from './components/ProtectedRoute';
import UserInfo from "./views/users/UserInfo";
import Friends from "./views/friends";

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
          <Route path="/Dashboard/:user" element={<UserInfo />}/>
          <Route path="/CardSet" element={<CardSet />} />
          <Route path="/CardSet/:set" element={<SetDescription />} />
          <Route path="/CardSet/:set/:card" element={<CardDescription />} />
          <Route path="/Friends" element={<Friends />} />
          <Route path="/Game" element={<Game />} />
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
