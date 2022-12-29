import React from "react";
import auth from "@firebase/auth";
import { DocumentData } from "firebase/firestore";

type Props = {
  user: auth.User | null,
  config: DocumentData | null,
  successfulCheckIns: number,
}
export const AuthContext = React.createContext<Props | null>(null);
