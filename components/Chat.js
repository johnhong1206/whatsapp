import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
//firebase.create
import { db } from "../config/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
//import getRecipientEmail from "../utils/getRecipientEmail";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

function Chat({ key, id, users }) {
  const router = useRouter();
  const [recipientSnapShot, setRecipientSnapShot] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "users"),
        where("email", "==", getRecipientEmail(users, user?.email))
      ),
      (snapshot) => {
        setRecipientSnapShot(snapshot.docs);
      }
    ),
      [db];
  });

  const recipient = recipientSnapShot[0]?.data();

  const getRecipientEmail = (users) =>
    users?.filter((userToFilter) => userToFilter !== user?.email)[0];

  const recipientEmail = getRecipientEmail(users);

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <div
      key={key}
      onClick={enterChat}
      className="flex items-center cursor-pointer p-4 hover:text-white hover:bg-[#d99ec9] hover:bg-gradient-to-l from-[#f6f0c4] hover:bg-opacity-50 space-x-2"
    >
      {recipient ? (
        <img
          src={recipient?.photoURL}
          className="w-12 h-12 rounded-full"
          alt={recipient?.username}
        />
      ) : (
        <img src={recipient?.photoURL} />
      )}
      <div className="flex flex-col ">
        <p className="font-bold">{recipient?.username}</p>
        <p className="font-light text-sm">{recipient?.email}</p>
      </div>
    </div>
  );
}

export default Chat;
