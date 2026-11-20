import axios from "axios";
import { useContext } from "react";
import UserContext from "../UserContext.tsx";
import { useNavigate } from "react-router";
import AuthContext from "../AuthContext";

function GuestLogin() {
  const { login } = useContext(AuthContext);
  const { upsertUser } = useContext(UserContext);
  const nav = useNavigate();

  const logIn = async function () {
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "log-in",
        {
          email: "guestLogin@fakemail.com",
          password: import.meta.env.VITE_GUEST_USER_PASSWORD,
        },
      );
      if (res.status != 200) {
        throw new Error(`HTTP Error! Status: ${res.status}`);
      } else {
        upsertUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        await login("guestLogin@fakemail.com");
        await nav("/");
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  return (
    <button onClick={logIn} style={{ borderRadius: "5px", padding: "1.5%" }}>
      Guest Login
    </button>
  );
}

export default GuestLogin;
