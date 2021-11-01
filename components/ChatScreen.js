import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import TimeAgo from "timeago-react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const Message = dynamic(() => import("./Message"));

//firebase.create
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

//icons
import {
  IoSearchOutline,
  IoAttachOutline,
  IoSendOutline,
  IoMenuOutline,
} from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { openSidebarModal } from "../features/modalSlice";

function ChatScreen({ chat }) {
  const dispatch = useDispatch();

  const router = useRouter();
  const id = router.query.id;
  const endofMessageRef = useRef(null);

  const user = useSelector(selectUser);
  const [recipientSnapShot, setRecipientSnapShot] = useState([]);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "chats", id, "messages"),
          orderBy("timeStamp", "asc")
        ),
        (snapshot) => {
          setMessages(snapshot.docs);
          messages.map((i) => {
            console.log(i.data());
          });
        }
      ),
    [db, id]
  );

  const getRecipientEmail = (users) =>
    users?.filter((userToFilter) => userToFilter !== user?.email)[0];

  const recipientEmail = getRecipientEmail(chat?.users, user);

  const send = (e) => {
    e.preventDefault();
    if (!input) {
      false;
    }

    const userRef = doc(db, "users", user?.uid);
    setDoc(
      userRef,
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );

    addDoc(collection(db, "chats", id, "messages"), {
      username: user?.displayName,
      message: input,
      timeStamp: serverTimestamp(),
      uid: user?.uid,
      email: user?.email,
    });
    setInput("");
    scrollToBottom();
  };

  useEffect(() => {
    onSnapshot(
      query(collection(db, "users"), where("email", "==", recipientEmail)),
      (snapshot) => {
        setRecipientSnapShot(snapshot.docs);
      }
    ),
      [db];
  });

  const recipient = recipientSnapShot[0]?.data();

  const scrollToBottom = () => {
    endofMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="w-full md:w-9/12">
      <div className=" sticky z-40 top-0  bg-white flex flex-col xl:flex-row items-center justify-between  px-8 py-2">
        <div className="flex items-center space-x-2">
          {recipient ? (
            <img
              src={recipient?.photoURL}
              className="w-20 h-20 object-contain rounded-full"
            />
          ) : (
            <img
              src={recipient?.photoURL}
              className="w-20 h-20 object-contain rounded-full"
            />
          )}
          <div>
            <h3 className="font-bold">{recipient?.username}</h3>
            {recipientSnapShot ? (
              <p className="text-sm text-gray-400">
                <span>Last active : </span>
                <span>
                  {recipient?.lastSeen?.toDate() ? (
                    <TimeAgo dateTime={recipient?.lastSeen?.toDate()} />
                  ) : (
                    "Unavailable"
                  )}
                </span>
              </p>
            ) : (
              <p>Loading Last Active...</p>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center space-x-4">
          <div>
            <IoSearchOutline className="w-8 h-8 inputIcon" />
          </div>
          <div>
            <IoAttachOutline className="w-8 h-8 inputIcon" />
          </div>
          <div>
            <IoIosMore className="w-8 h-8 inputIcon" />
          </div>
          <div className="inline-flex xl:hidden">
            <IoMenuOutline
              onClick={() => dispatch(openSidebarModal())}
              className="w-8 h-8 inputIcon"
            />
          </div>
        </div>
      </div>
      <div className="bg-[#f5e3e6] bg-gradient-to-b from-[#d9e4f5] h-[90vh] overflow-y-scroll scrollbar-hide">
        {messages.length > 0 && <div className="pt-12" />}

        {messages?.map((message) => (
          <Message key={message.id} message={message.data()} />
        ))}
        <div ref={endofMessageRef} className="pb-10" />
      </div>
      <form
        onSubmit={send}
        className="flex flex-row items-center sticky z-30 bottom-0 bg-white px-2  focus:shadow-2xl"
      >
        <MdOutlineEmojiEmotions className="w-8 h-8" />
        <input
          placeholder={`${user?.displayName} type something`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full flex-grow outline-none bg-white p-5 "
        />
        <IoSendOutline onClick={send} className="w-8 h-8" />
      </form>
    </div>
  );
}

export default ChatScreen;
