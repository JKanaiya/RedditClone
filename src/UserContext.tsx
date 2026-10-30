import { createContext } from "react";
import type { User } from "./App";

export type UserContext = {
  user: User | null;
  upsertUser: (user: User) => void;
};

const UserContext = createContext<UserContext>({
  user: null,
  upsertUser: (user: User) => {},
});

export default UserContext;
