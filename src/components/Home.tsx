import { useNavigate } from "react-router";
import axios from "axios";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import home from "../styles/home.module.css";
import useSWR from "swr";
// import home from "../styles/home.module.css";
// import load from "../styles/load.module.css";
import { useContext, useEffect, useState } from "react";
import PostContext from "../PostContext.tsx";
import type { SubReddit, User } from "../App.tsx";
import SubRedditContext from "../SubredditContext.tsx";
import Posts from "./Posts.tsx";
import Users from "./Users.tsx";
import PostFilter from "./PostFilter.tsx";
import Profile from "./Profile.tsx";
import Nav from "./Nav.tsx";
import PostComponent from "./Post.tsx";
// import { socket } from "../socket.ts";

function Home() {
  const { selectedPost } = useContext(PostContext);
  const { setSelectedSubreddit, selectedSubreddit } =
    useContext(SubRedditContext);
  // TODO: depends on how i will handle the user changing profile, atp, it might just be a different page. Namely the
  // typical user page, but with options to edit user data
  const [profileOpen, setProfileOpen] = useState(false);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterByFollowing, setFilterByFollowing] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const searchPosts = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.currentTarget.value);
  };

  const toggleSideBar = () => {
    setSideBarOpen(!sideBarOpen);
  };

  const toggleSelectedUser = (user: User | null) => {
    setSelectedUser(user);
  };

  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const toggleFilterByFollowing = () => {
    setFilterByFollowing(!filterByFollowing);
  };

  // const toggleProfileOpen = () => {
  //   setProfileOpen(!profileOpen);
  // };

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // TODO: find the correct function to be called on the base homepage, it will likely be getPosts
  const getSubreddits = async (url: string) => {
    const subreddits = await axios.get(url, config).catch(function (err) {
      console.log(err);
      if (401 == err.response.status) {
        console.error("Unauthorized");
      }
      return err.response;
    });
    // console.log(subreddits);
    return subreddits.data;
  };

  // TODO: related to above
  const {
    data: subreddits,
    error,
    mutate,
    isLoading: loading,
  } = useSWR(import.meta.env.VITE_BACKEND_URL + "subreddits", getSubreddits);
  // [use this for pagination]( https://swr.vercel.app/examples/infinite-loading )

  // useEffect(() => {
  //   console.log(error);
  //   console.log(data);
  //
  //   return () => {
  //     return;
  //   };
  // }, [error, data]);
  if (error) {
    console.log(error);
  }
  // console.log(subreddits);

  // TODO: change this to mutate when a new comment, post, or friend request accepted
  // socket.on("receive-message", () => {
  //   mutate();
  // });

  // TODO: find a better loading animation here
  // if (loading)
  //   return (
  //     <div className={load.container}>
  //       <img
  //         src="/assets/images/blendertimer-load-410.gif"
  //         className={load.icon}
  //       />
  //     </div>
  //   );
  if (error) nav("/error");
  return (
    <div className={home.page}>
      <Nav searchPosts={searchPosts} toggleSideBar={toggleSideBar} />
      <section className={home.container}>
        {window.innerWidth < 800 && sideBarOpen && (
          <aside className={home.sidebar}>
            <IoClose
              onClick={() => toggleSideBar()}
              className={home.sidebarClose}
            />
            {subreddits &&
              subreddits.map((subreddit: SubReddit) => (
                <li onClick={() => setSelectedSubreddit(subreddit)}>
                  <p>{subreddit.name}</p>
                </li>
              ))}
            <Users setSelectedUser={setSelectedUser} />
          </aside>
        )}

        {window.innerWidth >= 800 && !selectedUser && (
          <aside className={home.subreddits}>
            {subreddits &&
              subreddits.map((subreddit: SubReddit) => (
                <li onClick={() => setSelectedSubreddit(subreddit)}>
                  {subreddit.name}
                </li>
              ))}
          </aside>
        )}
        {selectedPost ? (
          <PostComponent post={selectedPost} />
        ) : selectedUser ? (
          <Profile
            user={selectedUser}
            toggleSelectedUser={toggleSelectedUser}
          />
        ) : selectedSubreddit ? (
          <Posts
            subId={selectedSubreddit.id}
            subName={selectedSubreddit.name}
            filterByFollowing={filterByFollowing}
            filter={filter}
          />
        ) : (
          <Posts
            subId={undefined}
            subName={undefined}
            filterByFollowing={filterByFollowing}
            filter={filter}
          />
        )}
        {/* NOTE: this and the above aside would render in a sidebar if the screenwidth is less than 800 */}
        {window.innerWidth >= 800 && !selectedUser && (
          <Users setSelectedUser={setSelectedUser} />
        )}
      </section>
    </div>
  );
}

export default Home;
