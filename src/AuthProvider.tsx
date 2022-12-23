import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { GoogleAuthProvider, User, signInWithPopup } from "@firebase/auth";
import { FirebaseError } from '@firebase/util';
import { auth, db } from "./Firebase";
import { doc, getDoc, DocumentData } from "firebase/firestore";

type Props = {
  children?: React.ReactNode
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [config, setConfig] = useState<DocumentData | null>(null);

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
      } else {
        getDoc(doc(db, "configuration", "pub-thursday")).then(docSnapshot => {
          if (docSnapshot.exists()) {
            setConfig(docSnapshot.data());
          }
        });
      }
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{user, config}}>{children}</AuthContext.Provider>;
};