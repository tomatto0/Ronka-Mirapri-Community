"use client";
import { useSession } from "next-auth/react";

export default function Page_test() {
  const { data: session, status } = useSession();

  const sign_out_handler = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/db/users`,
      { method: "DELETE", body: JSON.stringify({ id: session?.user?._id }) }
    );
  };

  return (
    <div>
      <button onClick={sign_out_handler}>탈퇴</button>
    </div>
  );
}
