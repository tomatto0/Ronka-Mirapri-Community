import EditorPageClient from "./pageClient";

export default async function PostPage({
  params,
}: {
  params: { [key: string]: string };
}) {
  const { index } = await params;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/db/posts/index?index=${index}`
  );
  const res = await response.json();

  return <EditorPageClient data={res.data} />;
}
