import { useContext, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router";
import AuthContext from "../AuthContext";
import navbar from "../styles/nav.module.css";

function Nav({
  searchPosts,
  toggleSideBar,
}: {
  searchPosts: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleSideBar: () => void;
}) {
  const { logout, isLoggedIn, login, user } = useContext(AuthContext);
  const nav = useNavigate();

  const navLogIn = () => nav("/auth/log-in");
  const navSignUp = () => nav("/auth/sign-up");
  const navSignOut = () => {
    logout();
    nav("/auth/log-in");
  };

  return (
    <nav className={navbar.container}>
      <section className={navbar.bar}>
        {window.innerWidth < 868 && (
          <RxHamburgerMenu onClick={() => toggleSideBar()} />
        )}
        {window.innerWidth >= 868 ? <h3>RedditClone</h3> : <h3> r/Clone </h3>}
        {window.innerWidth >= 868 && (
          <input
            type="text"
            name="search"
            id=""
            className={navbar.input}
            onChange={searchPosts}
            placeholder="Search post title and text"
          />
        )}
        {/* <RiSearch2Line className={icons.search} /> */}
        {isLoggedIn ? (
          <button className={navbar.authButton} onClick={() => navSignOut()}>
            Sign Out
          </button>
        ) : (
          <>
            <button className={navbar.authButton} onClick={() => navLogIn()}>
              Log In
            </button>
            <button className={navbar.authButton} onClick={() => navSignUp()}>
              Sign Up
            </button>
          </>
        )}
      </section>
      {window.innerWidth < 868 && (
        <input
          type="text"
          name="search"
          id=""
          className={navbar.input}
          onChange={searchPosts}
          placeholder="Search post title and text"
        />
      )}
    </nav>
  );
}

export default Nav;
