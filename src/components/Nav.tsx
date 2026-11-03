import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import AuthContext from "../AuthContext";

function Nav({
  searchPosts,
}: {
  searchPosts: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { logout, isLoggedIn, login, user } = useContext(AuthContext);
  const nav = useNavigate();

  const navLogIn = () => nav("/auth/log-in");
  const navSignUp = () => nav("/auth/sign-up");

  return (
    <nav>
      <h3>RedditClone</h3>
      <input
        type="text"
        name="search"
        id=""
        // className={home.input}
        onChange={searchPosts}
        placeholder="Search post title and text"
      />
      {/* <RiSearch2Line className={icons.search} /> */}
      <button onClick={() => navLogIn()}>Log In</button>
      <button onClick={() => navSignUp()}>Sign Up</button>
    </nav>
  );
}

export default Nav;
