import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { GoogleAuthProvider, User, signInWithPopup } from "@firebase/auth";
import { FirebaseError } from '@firebase/util';
import { auth } from "./Firebase";

type Props = {
  children?: React.ReactNode
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
          .then((result) => {
            setUser(result?.user);
          }).catch((error: FirebaseError) => {
            alert(error);
          });
      }
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};