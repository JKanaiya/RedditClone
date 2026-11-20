import { useContext, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router";
import AuthContext from "../AuthContext";
import navbar from "../styles/nav.module.css";
import type { FocusType } from "./Home";

function Nav({
  searchPosts,
  toggleSideBar,
  toggleFocus,
}: {
  searchPosts: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleSideBar: () => void;
  toggleFocus: (focus: FocusType) => void;
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
        {window.innerWidth >= 868 ? (
          <h3>
            reddit
            <span
              style={{
                color: "oklch(0.5845 0.2024 35.53)",
                fontStyle: "italic",
              }}
            >
              clone{" "}
            </span>
          </h3>
        ) : (
          <h3>
            {" "}
            r/
            <span
              style={{
                color: "oklch(0.5845 0.2024 35.53)",
              }}
            >
              clone{" "}
            </span>
          </h3>
        )}
        {window.innerWidth >= 868 && (
          <>
            <button
              onClick={() => toggleFocus({ active: true, post: null })}
              style={{ backgroundColor: "green" }}
              className={navbar.authButton}
            >
              New Post
            </button>
            <input
              type="text"
              name="search"
              id=""
              className={navbar.input}
              onChange={searchPosts}
              placeholder="Search post title and text"
            />
          </>
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
        <span
          style={{
            display: "flex",
            maxWidth: "100dvw",
            justifyContent: "space-around",
          }}
        >
          <button
            onClick={() => toggleFocus({ active: true, post: null })}
            className={navbar.authButton}
            style={{ backgroundColor: "green", maxWidth: "100px" }}
          >
            New Post
          </button>
          <input
            type="text"
            name="search"
            id=""
            className={navbar.input}
            onChange={searchPosts}
            placeholder="Search post title and text"
          />
        </span>
      )}
    </nav>
  );
}

export default Nav;
