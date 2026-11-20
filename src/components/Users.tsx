import ApiCall from "../apiCalls";
import { useNavigate } from "react-router";
import { RiUserFollowFill } from "react-icons/ri";
import useSWR from "swr";
import type { User } from "../App";
import usersAside from "../styles/users.module.css";
import { useContext } from "react";
import UserContext from "../UserContext";

function Users({ setSelectedUser }: { setSelectedUser: (user: User) => {} }) {
  const nav = useNavigate();
  const { user } = useContext(UserContext);
  const {
    data: users,
    error,
    mutate,
    isLoading: loading,
  } = useSWR(import.meta.env.VITE_BACKEND_URL + "users", ApiCall.getUsers);

  if (loading) return <p>loading...</p>;
  if (error) nav("/error");

  const follUsers = users.filter((following: User) => {
    // NOTE: this does not show anything since the logged in user has not followed anyone yet
    for (let foll in user?.following) {
      console.log(foll);
      if (following.id == foll.id) {
        return true;
      } else return false;
    }
  });

  const sendFollowRequest = async (userEmail: string) => {
    try {
      const response = await ApiCall.sendFollowRequest(userEmail);
      if (response.status != 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
    } catch (e) {
      // errorNotify("Failed to add comment!");
      console.log(`Error following user: ${e}`);
    }
  };

  const canFollow = (u: User) => {
    if (u.id != user.id) {
      const found = user?.following.find(
        (otherUser: User) => otherUser.id == u.id,
      );
      return found == undefined;
    } else {
      return false;
    }
  };

  console.log(follUsers);

  return (
    <aside className={usersAside.column}>
      <h3>Following</h3>
      {users &&
        users
          .filter((foll: User) => foll.id == user?.following.id)
          .map((user: User) => (
            <li onClick={() => setSelectedUser(user)}>
              <p>{user.name}</p>
            </li>
          ))}
      <hr
        style={{ height: 2, border: 0, background: "#333", margin: "10px 0" }}
      />
      <h3>Users</h3>
      {users &&
        users.map((u: User) => (
          <li
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p onClick={() => setSelectedUser(u)}>{u.name}</p>
            {canFollow(u) && (
              <RiUserFollowFill onClick={() => sendFollowRequest(u.email)} />
            )}
          </li>
        ))}
    </aside>
  );
}

export default Users;
