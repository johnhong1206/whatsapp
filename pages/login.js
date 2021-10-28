import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

function login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password).then((auth) => {
      //create user and logged in, redirect to homepage
      router.push("/");
    });
  };

  return (
    <div className="bg-gray-100 h-screen grid place-items-center ">
      <div className=" bg-white w-11/12 md:w-1/3 p-4 h-2/3 flex flex-col items-center justify-center shadow-2xl">
        <img
          src={"/images/WhatsappLogo.png"}
          width={100}
          height={100}
          layout="fixed"
          objectFit="contain"
        />
        <form className="flex flex-col w-full space-y-2">
          <input
            placeholder="email"
            className={`text-sm text-gray-500 w-full pr-3 py-5 px-4 border border-gray-primary rounded mb-2 focus-within:shadow-lg outline-none
            ${emailError !== null && "border-2 border-red-500"}`}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            placeholder="password"
            className={`text-sm text-gray-500 w-full pr-3 py-5 px-4 border border-gray-primary rounded mb-2 focus-within:shadow-lg outline-none
            ${passwordError !== null && "border-2 border-red-500"}`}
            onChange={(event) => setPassword(event.target.value)}
          />
        </form>
        <button
          onClick={signIn}
          type="submit"
          className="p-4 outline-none bg-[#0a8d48] text-white font-medium w-full shadow-md mt-2 hover:bg-white hover:text-[#0a8d48]"
        >
          Login
        </button>
        <div className="mt-4">
          <p className="">
            Have Account? Please
            <span
              onClick={() => router.push("/register")}
              className="hover:underline cursor-pointer ml-1"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default login;