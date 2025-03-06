import PostPageClient from "@/app/(pages)/post/[index]/pageClient";
import ErrorContainer from "@/app/components/ErrorContainer";

export async function generateMetadata({
  params,
}: {
  params: { [key: string]: string };
}) {
  const { index } = await params;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/db/posts/index?index=${index}`
  );
  const res = await response.json();

  if (res.data) {
    return {
      openGraph: {
        title: res.data.title,
        description: res.data.content,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/post/${index}`,
        images: res.data.image_url,
      },
    };
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ [key: string]: string }>;
}) {
  const { index } = await params;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/db/posts/index?index=${index}`
  );
  const res = await response.json();

  if (res.data) {
    return <PostPageClient post_data={res.data} />;
  } else {
    return (
      <main className="error-container">
        <ErrorContainer error_message="글을 찾을 수 없어요." show_home={true} />
        ;
      </main>
    );
  }
}
