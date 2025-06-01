import React, { createContext, useState } from "react";

const UserContext = createContext();
const us = JSON.parse(localStorage.getItem("user"))

function UserProvider({ children }) {
  const [user, setUser] = useState(us || null);

  return (
    <UserContext.Provider value={{ user, setUser}}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
