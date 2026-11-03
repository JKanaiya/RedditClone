import ApiCall from "../apiCalls";
import { useNavigate } from "react-router";
import useSWR from "swr";
import type { User } from "../App";
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

  console.log(follUsers);

  return (
    <aside>
      <h4>Following</h4>
      {users &&
        users
          .filter((foll: User) => foll.id == user?.following.id)
          .map((user: User) => (
            <li onClick={() => setSelectedUser(user)}>{user.name}</li>
          ))}
      <h4>Users</h4>
      {users &&
        users.map((user: User) => (
          <li onClick={() => setSelectedUser(user)}>{user.name}</li>
        ))}
    </aside>
  );
}

export default Users;
