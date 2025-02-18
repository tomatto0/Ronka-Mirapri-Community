import "../css/EditButton.css";

import { useRouter } from "next/navigation";

export default function EditButton() {
  const router = useRouter();

  const sendEditor = () => {
    localStorage.setItem("editor_mode", "true");
    router.push("/editor");
  };
  return (
    <>
      <button className="edit-button" onClick={sendEditor}>
        <img
          src={process.env.NEXT_PUBLIC_BASE_URL + "/img/edit-icon.svg"}
          alt="edit button"
        />
      </button>
    </>
  );
}
