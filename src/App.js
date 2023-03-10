import { Route, Routes } from "react-router-dom";
import Dashboard from "./views/dashboard";
import Login from "./views/auth/Login";
import SignIn from "./views/auth/SignIn";
import Recovery from "./views/auth/Recovery";
import { AuthLayout, AppLayaout } from "./views/global/Layaout";
function App() {

  return (
    <Routes>
      <Route path="/" element={<AppLayaout/>}>
        <Route index path="/Dashboard" element={<Dashboard />}/>
      </Route>
      <Route path="/" element={<AuthLayout/>}>
        <Route index path="/Login" element={<Login />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/Recovery" element={<Recovery />} />
      </Route>
    </Routes>
  );
}

export default App;
