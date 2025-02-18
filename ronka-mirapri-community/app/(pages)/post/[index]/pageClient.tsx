"use client";

import "../../../css/PostPageClient.css";
import ItemViewer from "@/app/components/ItemViewer";
import { Item } from "@/app/types/Item";
import { useAddLike, useDeleteLike, useGetPostLikes } from "./hooks/useLike";
import { job_category, job_category_group } from "@/app/utils/constants";

export default function PostPageClient({
  post_data,
}: {
  post_data: {
    author: { nickname: string };
    _id: string;
    index: number;
    image_url: string;
    equiped_item: Item[];
    title: string;
    content: string;
    sns: string;
    gender: string;
    race: string;
    job: string[];
    tag: string[];
    like_count: number;
    created_at: string;
  };
}) {
  const postIndex = post_data.index;
  const postId = post_data._id;
  const postDate = formatDate(new Date(post_data.created_at));
  function formatDate(date: Date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
    const dd = String(date.getDate()).padStart(2, "0"); // 일
    return `${yyyy}.${mm}.${dd}`;
  }

  function job_summary(jobs: string[]) {
    const summary: string[] = [];
    for (let job of jobs) {
      if (job in job_category_group) {
        job_category_group[job].map(i => summary.push(i));
      }
    }
    return jobs.filter(job => !summary.includes(job));
  }
  const jobs = job_summary(post_data.job);

  const { data, isLoading, isError } = useGetPostLikes(postIndex);
  const { deleteLikeMutation } = useDeleteLike(postIndex);
  const { addLikeMutation } = useAddLike(postIndex);

  const toggleLike = () => {
    if (data?.is_liked) {
      deleteLikeMutation(postId);
    } else {
      addLikeMutation(postId);
    }
  };

  const share_twitter = () => {
    const href = "https://twitter.com/intent/tweet?";
    const text = "롱카의 투영기록?에서 제 새로운 투영을 확인해보세요!";
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/post/${postIndex}`;
    const hashtags = "롱카의_투영기록";
    window.open(
      `${href}text=${encodeURIComponent(text)}&url=${encodeURIComponent(
        url
      )}&hashtags=${encodeURIComponent(hashtags)}`,
      "_blank"
    );
  };
  const share_bluesky = () => {
    const href = "https://bsky.app/intent/compose?";
    const text = "롱카의 투영기록?에서 제 새로운 투영을 확인해보세요!";
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/post/${postIndex}`;
    const hashtags = "롱카의_투영기록";
    window.open(
      `${href}text=${encodeURIComponent(`${text} ${url} #${hashtags}`)}`,
      "_blank"
    );
  };

  const TagBox = ({ content }: { content: string }) => {
    return <div className="tag-box">{content}</div>;
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생</div>;

  return (
    <main>
      <p className="post-title">{post_data.title}</p>
      <div className="post-title-box">
        <div>
          <p className="post-author">{post_data.author.nickname}</p>
          <p className="post-date">{postDate}</p>
        </div>
        <button className="like-button" onClick={toggleLike}>
          <span>{data?.is_liked ? "♥" : "♡"}</span>
          <span>{data?.like_count}</span>
        </button>
      </div>
      <div className="post-main-container">
        <img
          className="post-image"
          src={post_data.image_url}
          alt={post_data.title}
        />
        <div className="post-information">
          <ItemViewer equiped_item={post_data.equiped_item} />
          <div className="tag-container">
            <TagBox content={post_data.gender} />
            <TagBox content={post_data.race} />
            {jobs.map(job => (
              <TagBox content={job} key={`job-${job}`} />
            ))}
            {post_data.tag.map(tag => (
              <TagBox content={tag} key={`tag-${tag}`} />
            ))}
          </div>
        </div>
      </div>
      <p className="post-content">{post_data.content}</p>
      <p className="post-subtitle">SNS 게시글</p>
      <p className="post-sns">{post_data.sns}</p>
      <p className="post-subtitle">공유하기</p>
      <button className="share-button bluesky" onClick={share_bluesky}>
        BLUESKY
      </button>
      <button className="share-button twitter" onClick={share_twitter}>
        TWITTER
      </button>
    </main>
  );
}
