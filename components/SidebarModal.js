import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

//firebase.create
import { db, auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

//icons
import {
  IoSettingsOutline,
  IoChatboxOutline,
  IoMenuOutline,
} from "react-icons/io5";
import { IoIosMore } from "react-icons/io";

//service
import * as EmailValidator from "email-validator";
import Chat from "./Chat";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../features/userSlice";
import { useRouter } from "next/router";
import {
  closeSidebarModal,
  openUpdateProfileModal,
} from "../features/modalSlice";

function SidebarModal({ chat }) {
  const router = useRouter();
  const user = useSelector(selectUser);
  const [getUser, setGetUser] = useState("");
  const [tochatUser, setToChatUser] = useState([]);
  const dispatch = useDispatch();
  const extend = useSpring({
    transform: "translateX(0px)",
    from: { transform: "translateX(100%)" },
  });

  const img = user
    ? user?.photoURL
    : "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg";

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
    <animated.div
      style={extend}
      className="w-full md:w-9/12 lg:w-6/12 xl:w-4/12 h-full max-h-screen fixed z-40 top-0 right-0 bg-[#fafafa] shadow-2xl"
    >
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
          <div>
            <IoMenuOutline
              className="w-8 h-8 inputIcon"
              onClick={() => dispatch(closeSidebarModal())}
            />
          </div>
        </div>
      </div>
      <div className="bg-[#f5e3e6] bg-gradient-to-b from-[#d9e4f5] shadow-2xl -mt-4">
        <div className="w-full h-full flex items-center justify-center mt-4 py-8 inputIcon">
          <button onClick={creteChat} className="font-bold">
            Start A New Chat
          </button>
        </div>
        <div className="h-screen max-h-screen  overflow-y-scroll scrollbar-hide  ">
          {chat?.map((chat) => (
            <Chat key={chat.id} id={chat.id} users={chat?.data().users} />
          ))}
          <div className="pb-10" />
        </div>
      </div>
    </animated.div>
  );
}

export default SidebarModal;
