import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPosts, postSentence, getSupabaseClient } from "../../lib/supabase";

export function usePosts() {
    const queryClient = useQueryClient();

    const postsQuery = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const { data, error } = await fetchPosts();
            if (error) throw new Error(error.message || "Failed to fetch posts");
            return data;
        },
    });

    const postMutation = useMutation({
        mutationFn: async (sentence: string) => {
            const supabase = getSupabaseClient();
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();
            if (userError || !user) throw new Error("User not authenticated");
            const { error } = await postSentence(sentence, user.id);
            if (error) throw new Error(error.message || "Failed to post");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    return { ...postsQuery, postMutation };
}
