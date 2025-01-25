"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import App from "./components/App";

export default function Home() {
  return <App />;
  // const { data: session, status } = useSession();
  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }
  // return (
  //   <div>
  //     {session?.user.login ? (
  //       <div>
  //         <p>Welcome, {session.user?.nickname}</p>
  //         <button onClick={() => signOut()}>Sign out</button>
  //       </div>
  //     ) : (
  //       <div>
  //         <p>You are not signed in</p>
  //         <button onClick={() => signIn("google", { callbackUrl: "/signup" })}>
  //           Sign in with Google
  //         </button>
  //       </div>
  //     )}
  //   </div>
  // );
}
