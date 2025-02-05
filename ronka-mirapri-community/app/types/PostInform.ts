export type Pages = {
  pageParams: [];
  pages: Posts[];
};

export type Posts = {
  sucess: boolean;
  data: PostInform[];
};

export type PostInform = {
  _id: string;
  index: number;
  title: string;
  image_url: string;
  like_count: number;
  is_liked: boolean;
};

export type Postlike = {
  _id: string;
  like_count: number;
  is_liked: boolean;
};
