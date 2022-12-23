import React from "react";
import auth from "@firebase/auth";

export const AuthContext = React.createContext<auth.User | null>(null);
