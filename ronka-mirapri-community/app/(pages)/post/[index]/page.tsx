import PostPageClient from "@/app/components/PostPageClient";

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

  return <PostPageClient post_data={res.data} />;
}
