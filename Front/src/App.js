import { Route, Routes } from "react-router-dom";
import Game from "./Game/Game";
import Login from "./Login/Login"
import Rank from "./Rank/Rank"
import NavBar from "./Nav/Navbar";
import Error404 from './404/Error404'
import Profile from './Profile/Profile'
import { ModalProvider } from './Context/ModalsContext';
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <ModalProvider>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Game" element={<PrivateRoute><Game /></PrivateRoute>} />
          <Route path="/Rank" element={<PrivateRoute><Rank /></PrivateRoute>} />
          <Route path="/Profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </ModalProvider>
  );
}

export default App;