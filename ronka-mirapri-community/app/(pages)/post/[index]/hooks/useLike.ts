import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostLikes, deleteLike, addLike } from "../api/postLike";
import { Postlike } from "@/app/types/PostInform";

export const useGetPostLikes = (postIndex: number) => {
  return useQuery<Postlike>({
    queryKey: ["like", postIndex],
    queryFn: () => getPostLikes(postIndex),
    staleTime: 5000, // 5초
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useDeleteLike = (postIndex: number) => {
  const queryClient = useQueryClient();
  const { mutate: deleteLikeMutation } = useMutation({
    mutationFn: (postId: string) => deleteLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["like", postIndex] });
    },
    onError(error) {
      console.log(error);
    },
  });
  return { deleteLikeMutation };
};

export const useAddLike = (postIndex: number) => {
  const queryClient = useQueryClient();
  const { mutate: addLikeMutation } = useMutation({
    mutationFn: (postId: string) => addLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["like", postIndex] });
    },
    onError(error) {
      console.log(error);
    },
  });
  return { addLikeMutation };
};
