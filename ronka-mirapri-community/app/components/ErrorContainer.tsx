import Image from "next/image";
import Link from "next/link";

export default function ErrorContainer({
  error_message,
  show_home = false,
  small = false,
}: {
  error_message: string;
  show_home?: boolean;
  small?: boolean;
}) {
  return (
    <div className={`error-notice${small ? " small" : ""}`}>
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/img/not-pound.png`}
        alt="error"
      />
      <p>{error_message}</p>
      {show_home && <Link href="/">&gt; 홈으로 이동하기</Link>}
    </div>
  );
}
