import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./authPages/Login";
import Register from "./authPages/Register";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import DeleteAccount from "./authPages/DeleteAccount";
import ChangePassword from "./authPages/ChangePassword";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AddPost from "./pages/AddPost";
import PersistLogin from "./authComponents/PersistLogin";
import { PrivateOutlet } from "./authComponents/PrivateOutlet";
import { useEffect } from "react";

function App() {
  // When the component mounts, get the CSRF cookie.
  useEffect(() => {
    async function getCSRFCookie() {
      try {
        const result = await fetch(
          "http://localhost:8000/api/auth/csrf_cookie",
          {
            method: "POST",
            credentials: "include",
          }
        );
        await result.json();
      } catch (err) {
        console.log(err);
      }
    }

    getCSRFCookie();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<PersistLogin />}>
            <Route element={<PrivateOutlet />}>
              <Route index element={<Home />} />
              <Route path="deleteAccount" element={<DeleteAccount />} />
              <Route path="resetPassword" element={<ChangePassword />} />
              <Route path="profile/:id" element={<Profile />} />
              <Route path="edit" element={<EditProfile />} />
              <Route path="addPost" element={<AddPost />} />
            </Route>
          </Route>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
