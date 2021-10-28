import React, { useEffect, useState } from "react";
import Head from "next/head";
import { selectUser } from "../../features/userSlice";
import { useSelector } from "react-redux";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

//firebase.create
import { app, db } from "../../config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  getDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { useRouter } from "next/router";
import ChatScreen from "../../components/ChatScreen";
import UpdateModal from "../../components/UpdateModal";
import SidebarModal from "../../components/SidebarModal";
import {
  selectOpenSidebar,
  selectUpdateProfileModal,
} from "../../features/modalSlice";
import ChatSidebar from "../../components/ChatSidebar";

function Chat({ chat }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const id = router.query.id;
  const updateProfileModal = useSelector(selectUpdateProfileModal);
  const sidebarModal = useSelector(selectOpenSidebar);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "chats"),
        where("users", "array-contains", user?.email)
      ),
      (snapshot) => {
        setChats(snapshot.docs);
      }
    );
    return unsubscribe;
  }, [db]);

  const user = useSelector(selectUser);

  const getRecipientEmail = (users) =>
    users?.filter((userToFilter) => userToFilter !== user?.email)[0];

  const chatUser = getRecipientEmail(chat?.users);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Head>
        <title>Chat with {chatUser}</title>
      </Head>
      <main className="flex flex-row">
        <ChatSidebar chat={chats} />
        <ChatScreen chat={chat} />
      </main>
      {updateProfileModal && <UpdateModal />}
      {sidebarModal && <SidebarModal chat={chats} />}
    </div>
  );
}

export default Chat;
export async function getServerSideProps(context) {
  const docRef = doc(db, "chats", context.query.id);
  const messageRef = query(
    collection(db, "chats", context.query.id, "messages"),
    orderBy("timeStamp", "desc")
  );

  const chatRes = await getDoc(docRef);
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };
  const messagesRes = await getDocs(messageRef);

  console.log("message", messagesRes);

  //console.log(messagesRes);

  return {
    props: {
      chat: chat,
    },
  };
}
