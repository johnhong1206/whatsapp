import Head from "next/head";
import { auth, db } from "../config/firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useRouter } from "next/router";

//components
import Sidebar from "../components/Sidebar";

//reduc
import { login, logout, selectUser } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import UpdateModal from "../components/UpdateModal";
import { selectUpdateProfileModal } from "../features/modalSlice";

import Login from "./login";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const updateProfileModal = useSelector(selectUpdateProfileModal);
  const authUser = useSelector(selectUser);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        const uid = user.uid;
        const userRef = doc(db, "users", uid);
        setDoc(
          userRef,
          {
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );

        dispatch(
          login({
            displayName: user?.displayName,
            email: user?.email,
            uid: user?.uid,
            photoURL: user?.photoURL,
          })
        );

        // ...
      } else {
        // User is signed out
        // ...
        dispatch(logout());
      }
    });
  }, [db, auth]);

  useEffect(() => {
    if (!authUser) {
      router.push("/login");
    }
  }, [authUser]);

  if (!authUser) return <Login />;

  return (
    <div>
      <Head>
        <title>Whatsapp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Sidebar />
      </main>
      {updateProfileModal && <UpdateModal />}
    </div>
  );
}
