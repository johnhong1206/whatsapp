import React, { useEffect, useState } from "react";
//firebase.create
import { db, auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import dynamic from "next/dynamic";
const Chat = dynamic(() => import("./Chat"));

import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

//icons
import { IoSettingsOutline, IoChatboxOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";

//service
import * as EmailValidator from "email-validator";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../features/userSlice";
import { useRouter } from "next/router";
import { openUpdateProfileModal } from "../features/modalSlice";

function Sidebar() {
  const router = useRouter();
  const [chat, setChat] = useState([]);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const img = user
    ? user?.photoURL
    : "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg";

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "chats"),
        where("users", "array-contains", user?.email)
      ),
      (snapshot) => {
        setChat(snapshot.docs);
      }
    );
    return unsubscribe;
  }, [db]);

  const ChatAlreadyExists = (recipientEmail) =>
    !!chat?.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  const creteChat = () => {
    const input = prompt(
      "Please Enter an Email Address for you  to wish to Chat"
    );
    setGetUser(input);

    if (!input) return null;
    if (EmailValidator.validate(input) && !ChatAlreadyExists(input)) {
      addDoc(collection(db, "chats"), {
        users: [user?.email, input],
      }).then(() => {
        router.reload();
      });
    } else {
      alert("chat exist");
    }
  };

  const signout = () => {
    signOut(auth)
      .then(() => {
        router.replace("/");
        dispatch(logout());
      })
      .catch((error) => {});
  };

  return (
    <div className="flex flex-col h-full max-h-screen w-screen md:w-3/12 bg-white overflow-hidden">
      <div className="flex items-center justify-between shadow-2xl px-8 py-2 sticky z-50 top-0">
        <img
          onClick={signout}
          src={img}
          className="w-20 h-20 object-contain rounded-full inputIcon"
        />
        <div className="flex flex-row items-center space-x-4">
          <div>
            <IoChatboxOutline
              onClick={creteChat}
              className="w-8 h-8 inputIcon"
            />
          </div>
          <div>
            <IoSettingsOutline
              onClick={() => dispatch(openUpdateProfileModal())}
              className="w-8 h-8 inputIcon"
            />
          </div>
          <div>
            <IoIosMore className="w-8 h-8 inputIcon" />
          </div>
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-center mt-4 py-8 inputIcon">
        <button onClick={creteChat} className="font-bold">
          Start A New Chat
        </button>
      </div>
      <div className="h-screen max-h-screen bg-white overflow-y-scroll scrollbar-hide  bg-gradient-to-t from-[#06202A] ">
        {chat?.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat?.data().users} />
        ))}
        <div className="pb-10" />
      </div>
    </div>
  );
}

export default Sidebar;
