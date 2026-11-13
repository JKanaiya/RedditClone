// import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Auth from "./components/Auth.tsx";
import Home from "./components/Home.tsx";
import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import "./styles/reset.css";
// import SelectionContext from "./SelectionContext.js";
import ErrorPage from "./components/ErrorPage.js";
import axios from "axios";
import UserContext from "./UserContext.tsx";
import SubredditContext from "./SubredditContext.tsx";
import PostContext from "./PostContext.tsx";

export type SubReddit = {
  id: number;
  name: string | undefined;
  subscribers: User[] | [];
  posts: Post[] | [];
};

export type FollowRequest = {
  id: number;
  receiver: User;
  sender: User;
  receiverId: number;
  senderId: number;
};

export type Post = {
  id: number;
  title: string;
  text: string;
  postImageUrl: string | null;
  votes: Vote[] | [];
  comments: Comment[] | [];
  subRedditId: number;
  user: User;
};
export type Vote = {
  id: number;
  positive: boolean;
  user: User;
  userId: number;
  post: Post | undefined;
  comment: Comment | undefined;
  commentId: number;
  postId: number;
};

export type Comment = {
  id: number;
  text: string;
  post: Post;
  postId: number;
  userId: number;
  user: User;
  edited: string | undefined;
  parentCommentId: number | undefined;
  subComments: Comment[] | [];
  votes: Vote[] | [];
};

export type User = {
  email: string;
  id: number;
  name: string;
  profileImageUrl: string | undefined;
  following: User[] | [];
  followers: User[] | [];
  posts: Post[] | [];
  // TODO: previously, this was used to aid in setting the uesr's new profile image,
  // it may or may not be useful in this application, we'll see
  // profileImage: string | undefined;
  followRequests: FollowRequest[] | [];
  subReddits: SubReddit[] | [];
  spectator: boolean | undefined;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedSubreddit, setSelectedSubreddit] = useState<SubReddit | null>(
    null,
  );
  const [user, setUser] = useState<User | null>(null);

  const [email, setEmail] = useState<string | null>(null);

  const toggleSelectedPost = (post: Post | null) => {
    setSelectedPost(post);
  };

  useEffect(() => {
    const email = localStorage.getItem("rcEmail");
    // const specEmail = localStorage.getItem("messaging_app_spec_email");
    // if (specEmail) {
    // } else {
    login(email);
    // }
  }, [isLoggedIn]);

  const upsertUser = (user: User | null) => {
    setUser(user);
  };

  const authCheck = async function () {
    const token = localStorage.getItem("token");
    const result = await axios
      .get(import.meta.env.VITE_BACKEND_URL + "auth-check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  const login = async (email: string) => {
    const res = await authCheck();
    if (res.status == 200 || res == "authed") {
      setEmail(email);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      // TODO: should this be remove all?
      localStorage.removeItem("user");
      localStorage.removeItem("rcEmail");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    upsertUser(null);
    setEmail(null);
  };

  return (
    <AuthContext value={{ isLoggedIn, email, login, logout }}>
      <PostContext
        value={{ selectedPost, setSelectedPost, toggleSelectedPost }}
      >
        <SubredditContext value={{ selectedSubreddit, setSelectedSubreddit }}>
          <UserContext value={{ upsertUser, user }}>
            <Router>
              <Routes>
                <Route
                  path="/"
                  element={
                    isLoggedIn ? (
                      <Home />
                    ) : (
                      <Navigate replace to={"/auth/log-in"} />
                    )
                  }
                  errorElement=<ErrorPage />
                />
                <Route path="auth" element=<Auth /> errorElement=<ErrorPage />>
                  <Route
                    path="sign-up"
                    element=<SignUp />
                    errorElement=<ErrorPage />
                  />
                  <Route
                    path="log-in"
                    element=<Login />
                    errorElement=<ErrorPage />
                  />
                </Route>
                <Route path="error" element=<ErrorPage />></Route>
              </Routes>
            </Router>
          </UserContext>
        </SubredditContext>
      </PostContext>
    </AuthContext>
  );
}

export default App;
