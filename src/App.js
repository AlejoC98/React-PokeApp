import { Route, Routes } from "react-router-dom";
import Dashboard from "./views/dashboard";
import Login from "./views/auth/Login";
import { AuthLayout, AppLayaout } from "./views/global/Layaout";
function App() {

  return (
    <Routes>
      <Route path="/" element={<AppLayaout/>}>
        <Route index path="/Dashboard" element={<Dashboard />}/>
      </Route>
      <Route path="/" element={<AuthLayout/>}>
        <Route index path="/Login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
