import { useNavigate } from "react-router";
import axios from "axios";
import useSWR from "swr";
import home from "../styles/home.module.css";
import load from "../styles/load.module.css";
import { useContext, useEffect, useState } from "react";
import PostContext from "../PostContext.tsx";
// import { socket } from "../socket.ts";

function Home() {
  const { selectedPost } = useContext(PostContext);
  // TODO: depends on how i will handle the user changing profile, atp, it might just be a different page. Namely the
  // typical user page, but with options to edit user data
  // const [profileOpen, setProfileOpen] = useState(false);

  const nav = useNavigate();
  const token = localStorage.getItem("token");

  // const toggleProfileOpen = () => {
  //   setProfileOpen(!profileOpen);
  // };

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // TODO: find the correct function to be called on the base homepage, it will likely be getPosts
  // const getChatrooms = async (url: string) => {
  //   const chats = await axios.get(url, config).catch(function (err) {
  //     console.log(err);
  //     if (401 == err.response.status) {
  //       console.error("Unauthorized");
  //     }
  //     return err.response;
  //   });
  //   console.log(chats);
  //   return chats.data;
  // };

  // TODO: related to above
  const {
    data: chatrooms,
    error,
    mutate,
    isLoading: loading,
  } = useSWR(import.meta.env.VITE_BACKEND_URL + "chatrooms", getChatrooms);
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
  console.log(chatrooms);

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
  return <></>;
}

export default Home;
