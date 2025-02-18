import Link from "next/link";

export default function AutoLink({
  children,
  className,
  target,
}: {
  children: string;
  className: string;
  target?: string;
}) {
  const regURL = /^(https?|ftp):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/i;
  if (regURL.test(children)) {
    return (
      <Link className={className} href={children} target={target}>
        {children}
      </Link>
    );
  }
  return <p className={className}>{children}</p>;
}
