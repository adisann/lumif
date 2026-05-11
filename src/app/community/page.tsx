"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";
import {
  HiPlus,
  HiChatBubbleLeft,
  HiOutlineFaceSmile,
  HiXMark,
  HiChevronDown,
  HiFunnel,
  HiEllipsisHorizontal,
  HiMagnifyingGlass,
  HiPaperAirplane,
  HiBookmark,
  HiOutlineBookmark,
  HiFlag,
  HiTrash,
  HiHeart,
} from "react-icons/hi2";

type PostCategory = "cerita" | "support" | "darurat" | "lokasi";
type FilterKey = "semua" | PostCategory;
type SortKey = "terbaru" | "populer" | "ramai";

type Reaction = {
  emoji: string;
  count: number;
  userReacted?: boolean;
};

type Reply = {
  id: string;
  name: string;
  time: string;
  content: string;
  avatar: string;
};

type Post = {
  id: string;
  userId: string | null;
  name: string;
  avatar: string;
  time: string;
  tag: string;
  category: PostCategory;
  content: string;
  reactions: Reaction[];
  replies: Reply[];
  bookmarked?: boolean;
  ownPost?: boolean;
};

type CommunityPostRow = {
  id: string;
  user_id: string | null;
  author_name: string;
  tag: string | null;
  category: string | null;
  content: string;
  created_at: string;
};

type CommunityReactionRow = {
  id: string;
  post_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
};

type CommunityReplyRow = {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  content: string;
  created_at: string;
};

const FILTER_OPTIONS: { key: FilterKey; label: string; emoji: string }[] = [
  { key: "semua", label: "Semua", emoji: "🌐" },
  { key: "cerita", label: "Cerita", emoji: "📝" },
  { key: "support", label: "Support", emoji: "🤝" },
  { key: "darurat", label: "Darurat", emoji: "⚡" },
  { key: "lokasi", label: "Lokasi", emoji: "📍" },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "terbaru", label: "Terbaru" },
  { key: "populer", label: "Populer" },
  { key: "ramai", label: "Paling Ramai" },
];

const AVAILABLE_EMOJIS = ["💪", "❤️", "🌱", "🔥", "👏", "🫂", "✨", "🙏"];

const QUICK_REPLIES = [
  "Semangat, kamu nggak sendiri 💪",
  "Aku dukung kamu. Pelan-pelan ya 🌱",
  "Terima kasih sudah berani cerita ❤️",
  "Tarik napas dulu, kamu aman sekarang 🫂",
];

function normalizeCategory(category: string | null): PostCategory {
  if (
    category === "cerita" ||
    category === "support" ||
    category === "darurat" ||
    category === "lokasi"
  ) {
    return category;
  }

  return "cerita";
}

function getRelativeTime(dateValue: string) {
  const createdAt = new Date(dateValue).getTime();
  const now = Date.now();
  const diffMs = now - createdAt;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diffMs < minute) return "Baru saja";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} menit lalu`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)} jam lalu`;
  if (diffMs < week) return `${Math.floor(diffMs / day)} hari lalu`;

  return new Date(dateValue).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getTotalReactions(post: Post) {
  return post.reactions.reduce((total, reaction) => total + reaction.count, 0);
}

function groupReactionsByPost(
  reactions: CommunityReactionRow[],
  currentUserId: string | null
) {
  const grouped: Record<string, Reaction[]> = {};

  reactions.forEach((reaction) => {
    if (!grouped[reaction.post_id]) {
      grouped[reaction.post_id] = [];
    }

    const existingReaction = grouped[reaction.post_id].find(
      (item) => item.emoji === reaction.emoji
    );

    if (existingReaction) {
      existingReaction.count += 1;

      if (currentUserId && reaction.user_id === currentUserId) {
        existingReaction.userReacted = true;
      }

      return;
    }

    grouped[reaction.post_id].push({
      emoji: reaction.emoji,
      count: 1,
      userReacted: Boolean(currentUserId && reaction.user_id === currentUserId),
    });
  });

  return grouped;
}

function groupRepliesByPost(replies: CommunityReplyRow[]) {
  const grouped: Record<string, Reply[]> = {};

  replies.forEach((reply) => {
    if (!grouped[reply.post_id]) {
      grouped[reply.post_id] = [];
    }

    grouped[reply.post_id].push({
      id: reply.id,
      name: reply.author_name || "Kamu",
      avatar: reply.author_name === "Kamu" ? "🙂" : "🌱",
      time: getRelativeTime(reply.created_at),
      content: reply.content,
    });
  });

  return grouped;
}

function getPreviewText(content: string, expanded: boolean) {
  if (expanded || content.length <= 170) return content;
  return `${content.slice(0, 170).trim()}...`;
}

export default function CommunityScreen() {
  const supabase = useMemo(() => createClient(), []);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("semua");
  const [sort, setSort] = useState<SortKey>("terbaru");

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSortPanel, setShowSortPanel] = useState(false);

  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isSavingPost, setIsSavingPost] = useState(false);

  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTag, setNewPostTag] = useState("#ceritaku");
  const [newPostCategory, setNewPostCategory] =
    useState<PostCategory>("cerita");
  const [anonymousPost, setAnonymousPost] = useState(true);

  const [activeEmojiPickerPostId, setActiveEmojiPickerPostId] = useState<
    string | null
  >(null);
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
  const [openedRepliesPostId, setOpenedRepliesPostId] = useState<string | null>(
    null
  );
  const [replyDraftByPostId, setReplyDraftByPostId] = useState<
    Record<string, string>
  >({});
  const [toast, setToast] = useState("");

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  const mapRowToPost = (
    row: CommunityPostRow,
    userId: string | null,
    reactionsByPost: Record<string, Reaction[]> = {},
    repliesByPost: Record<string, Reply[]> = {}
  ): Post => {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.author_name || "Anonim Lumif",
      avatar: row.author_name === "Anonim Lumif" ? "🌱" : "🙂",
      time: getRelativeTime(row.created_at),
      tag: row.tag || "#ceritaku",
      category: normalizeCategory(row.category),
      content: row.content,
      reactions: reactionsByPost[row.id] ?? [],
      replies: repliesByPost[row.id] ?? [],
      bookmarked: false,
      ownPost: Boolean(userId && row.user_id === userId),
    };
  };

  const loadPosts = async () => {
    setIsLoadingPosts(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id ?? null;
    setCurrentUserId(userId);

    const { data: postRows, error: postError } = await supabase
      .from("community_posts")
      .select("id, user_id, author_name, tag, category, content, created_at")
      .order("created_at", { ascending: false });

    if (postError) {
      console.error("Gagal mengambil community_posts:", postError);
      setIsLoadingPosts(false);
      showToast("Gagal memuat komunitas");
      return;
    }

    const postsData = postRows ?? [];
    const postIds = postsData.map((post) => post.id);

    let reactionsByPost: Record<string, Reaction[]> = {};
    let repliesByPost: Record<string, Reply[]> = {};

    if (postIds.length > 0) {
      const { data: reactionRows, error: reactionError } = await supabase
        .from("community_reactions")
        .select("id, post_id, user_id, emoji, created_at")
        .in("post_id", postIds);

      if (reactionError) {
        console.error("Gagal mengambil community_reactions:", reactionError);
      } else {
        reactionsByPost = groupReactionsByPost(reactionRows ?? [], userId);
      }

      const { data: replyRows, error: replyError } = await supabase
        .from("community_replies")
        .select("id, post_id, user_id, author_name, content, created_at")
        .in("post_id", postIds)
        .order("created_at", { ascending: false });

      if (replyError) {
        console.error("Gagal mengambil community_replies:", replyError);
      } else {
        repliesByPost = groupRepliesByPost(replyRows ?? []);
      }
    }

    setPosts(
      postsData.map((row) =>
        mapRowToPost(row, userId, reactionsByPost, repliesByPost)
      )
    );

    setIsLoadingPosts(false);
  };

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const result = posts.filter((post) => {
      const matchFilter = filter === "semua" || post.category === filter;
      const matchQuery =
        !normalizedQuery ||
        post.name.toLowerCase().includes(normalizedQuery) ||
        post.tag.toLowerCase().includes(normalizedQuery) ||
        post.content.toLowerCase().includes(normalizedQuery);

      return matchFilter && matchQuery;
    });

    if (sort === "populer") {
      return [...result].sort(
        (a, b) => getTotalReactions(b) - getTotalReactions(a)
      );
    }

    if (sort === "ramai") {
      return [...result].sort((a, b) => b.replies.length - a.replies.length);
    }

    return result;
  }, [filter, posts, query, sort]);

  const handleCreatePost = async () => {
    const content = newPostContent.trim();

    if (!content) return;

    setIsSavingPost(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setIsSavingPost(false);
      showToast("Sesi login habis. Login ulang dulu.");
      return;
    }

    const cleanTag = newPostTag.trim();
    const tag = cleanTag
      ? cleanTag.startsWith("#")
        ? cleanTag
        : `#${cleanTag}`
      : "#ceritaku";

    const { data, error } = await supabase
      .from("community_posts")
      .insert({
        user_id: user.id,
        author_name: anonymousPost ? "Anonim Lumif" : "Kamu",
        tag,
        category: newPostCategory,
        content,
      })
      .select("id, user_id, author_name, tag, category, content, created_at")
      .single();

    setIsSavingPost(false);

    if (error) {
      console.error("Gagal membuat community_posts:", error);
      showToast("Gagal mengirim postingan");
      return;
    }

    setPosts((prev) => [mapRowToPost(data, user.id, {}, {}), ...prev]);
    setNewPostContent("");
    setNewPostTag("#ceritaku");
    setNewPostCategory("cerita");
    setAnonymousPost(true);
    setIsCreatingPost(false);
    showToast("Postingan berhasil dikirim 🌱");
  };

  const handleToggleReaction = async (postId: string, emoji: string) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      showToast("Login dulu untuk memberi reaction");
      return;
    }

    const targetPost = posts.find((post) => post.id === postId);
    const targetReaction = targetPost?.reactions.find(
      (reaction) => reaction.emoji === emoji
    );
    const hasReacted = Boolean(targetReaction?.userReacted);

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        const existingReactionIndex = post.reactions.findIndex(
          (reaction) => reaction.emoji === emoji
        );

        const updatedReactions = post.reactions.map((reaction) => ({
          ...reaction,
        }));

        if (existingReactionIndex >= 0) {
          const reaction = updatedReactions[existingReactionIndex];

          if (reaction.userReacted) {
            reaction.count -= 1;
            reaction.userReacted = false;

            if (reaction.count <= 0) {
              updatedReactions.splice(existingReactionIndex, 1);
            }
          } else {
            reaction.count += 1;
            reaction.userReacted = true;
          }
        } else {
          updatedReactions.push({
            emoji,
            count: 1,
            userReacted: true,
          });
        }

        return {
          ...post,
          reactions: updatedReactions,
        };
      })
    );

    setActiveEmojiPickerPostId(null);

    if (hasReacted) {
      const { error } = await supabase
        .from("community_reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .eq("emoji", emoji);

      if (error) {
        console.error("Gagal menghapus reaction:", error);
        showToast("Gagal menghapus reaction");
        await loadPosts();
      }

      return;
    }

    const { error } = await supabase.from("community_reactions").insert({
      post_id: postId,
      user_id: user.id,
      emoji,
    });

    if (error) {
      console.error("Gagal menyimpan reaction:", error);
      showToast("Gagal menyimpan reaction");
      await loadPosts();
    }
  };

  const handleToggleExpanded = (postId: string) => {
    setExpandedPostIds((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleToggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post
      )
    );

    setActiveMenuPostId(null);
    showToast("Status simpan diperbarui");
  };

  const handleDeletePost = async (postId: string) => {
    const post = posts.find((item) => item.id === postId);

    if (!post?.ownPost) {
      showToast("Kamu hanya bisa menghapus postingan sendiri");
      setActiveMenuPostId(null);
      return;
    }

    const previousPosts = posts;

    setPosts((prev) => prev.filter((item) => item.id !== postId));
    setActiveMenuPostId(null);

    const { error } = await supabase
      .from("community_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.error("Gagal menghapus community_posts:", error);
      setPosts(previousPosts);
      showToast("Gagal menghapus postingan");
      return;
    }

    showToast("Postingan kamu dihapus");
  };

  const handleReportPost = () => {
    setActiveMenuPostId(null);
    showToast("Laporan diterima. Terima kasih sudah menjaga komunitas.");
  };

  const handleOpenReplies = (postId: string) => {
    setOpenedRepliesPostId((prev) => (prev === postId ? null : postId));
  };

  const handleSendReply = async (postId: string, forcedText?: string) => {
    const content = (forcedText ?? replyDraftByPostId[postId] ?? "").trim();

    if (!content) return;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      showToast("Login dulu untuk membalas");
      return;
    }

    const optimisticReply: Reply = {
      id: crypto.randomUUID(),
      name: "Kamu",
      avatar: "🙂",
      time: "Baru saja",
      content,
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, replies: [optimisticReply, ...post.replies] }
          : post
      )
    );

    setReplyDraftByPostId((prev) => ({
      ...prev,
      [postId]: "",
    }));

    setOpenedRepliesPostId(postId);

    const { data, error } = await supabase
      .from("community_replies")
      .insert({
        post_id: postId,
        user_id: user.id,
        author_name: "Kamu",
        content,
      })
      .select("id, post_id, user_id, author_name, content, created_at")
      .single();

    if (error) {
      console.error("Gagal menyimpan community_replies:", error);
      showToast("Gagal menyimpan balasan");
      await loadPosts();
      return;
    }

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const withoutOptimistic = post.replies.filter(
          (reply) => reply.id !== optimisticReply.id
        );

        const savedReply: Reply = {
          id: data.id,
          name: data.author_name || "Kamu",
          avatar: "🙂",
          time: getRelativeTime(data.created_at),
          content: data.content,
        };

        return {
          ...post,
          replies: [savedReply, ...withoutOptimistic],
        };
      })
    );

    showToast("Balasan dikirim 🌱");
  };

  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#FAFAFA] font-lexend text-black">
      <header className="shrink-0 bg-[#FAFAFA] px-[20px] pb-[14px] pt-[20px]">
        <div className="mb-[18px] flex items-start justify-between gap-[12px]">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold leading-none text-[#7A7A7A]">
              Ruang aman
            </p>

            <h1 className="mt-[6px] truncate font-poppins text-[22px] font-extrabold leading-[28px] tracking-[-0.5px] text-black">
              Interaksi Komunitas
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-[8px]">
            <button
              type="button"
              onClick={() => setQuery((prev) => (prev ? "" : " "))}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white text-[21px] text-black shadow-[0px_3px_12px_rgba(0,0,0,0.08)] transition active:scale-95"
              aria-label="Cari postingan"
            >
              <HiMagnifyingGlass />
            </button>

            <button
              type="button"
              onClick={() => setIsCreatingPost(true)}
              className="flex h-[42px] shrink-0 items-center justify-center gap-[6px] rounded-full bg-[#2D936C] px-[16px] font-poppins text-[13px] font-bold text-white shadow-[0px_6px_16px_rgba(45,147,108,0.24)] transition active:scale-95"
            >
              <HiPlus className="text-[17px]" />
              <span>Post</span>
            </button>
          </div>
        </div>

        {query !== "" && (
          <div className="mb-3 flex h-11 items-center gap-2 rounded-2xl bg-white px-4 shadow-sm">
            <HiMagnifyingGlass className="text-[#7A7A7A]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama, tag, atau cerita..."
              className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#9A9A9A]"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[#7A7A7A]"
            >
              <HiXMark />
            </button>
          </div>
        )}

        <div className="relative flex items-center justify-between gap-[12px]">
          <div className="flex min-w-0 items-center gap-[8px]">
            <button
              type="button"
              onClick={() => {
                setShowFilterPanel((prev) => !prev);
                setShowSortPanel(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2D936C] text-white active:scale-95"
            >
              <HiFunnel />
              Filter
              <HiChevronDown />
            </button>

            <button
              type="button"
              onClick={() => {
                setShowSortPanel((prev) => !prev);
                setShowFilterPanel(false);
              }}
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#2D936C] text-white shadow-[0px_5px_14px_rgba(45,147,108,0.18)] transition active:scale-95"
              aria-label="Urutkan postingan"
            >
              <HiChevronDown />
            </button>
          </div>

          <p className="shrink-0 text-[12px] font-bold text-[#7A7A7A]">
            {filteredPosts.length} postingan
          </p>

          {showFilterPanel && (
            <div className="absolute left-0 top-11 z-20 w-44 rounded-2xl bg-white p-2 shadow-xl">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => {
                    setFilter(option.key);
                    setShowFilterPanel(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-semibold ${filter === option.key
                    ? "bg-[#E6F4EA] text-[#15835A]"
                    : "text-[#1F1F1F] hover:bg-[#F5F5F5]"
                    }`}
                >
                  <span>{option.emoji}</span>
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {showSortPanel && (
            <div className="absolute left-[110px] top-11 z-20 w-40 rounded-2xl bg-white p-2 shadow-xl">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => {
                    setSort(option.key);
                    setShowSortPanel(false);
                  }}
                  className={`w-full rounded-xl px-3 py-2 text-left text-[12px] font-semibold ${sort === option.key
                    ? "bg-[#E6F4EA] text-[#15835A]"
                    : "text-[#1F1F1F] hover:bg-[#F5F5F5]"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <section className="flex-1 overflow-y-auto px-[20px] pb-[calc(112px+env(safe-area-inset-bottom))] pt-[12px]">
        {isLoadingPosts ? (
          <div className="rounded-[22px] bg-white p-5 text-center text-[13px] font-semibold text-[#777] shadow-sm">
            Memuat komunitas...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-[22px] bg-white p-5 text-center shadow-sm">
            <p className="text-[36px]">🌱</p>
            <h2 className="mt-2 font-poppins text-[16px] font-bold">
              Belum ada postingan
            </h2>
            <p className="mt-1 text-[12px] leading-5 text-[#777]">
              Coba filter lain atau jadilah orang pertama yang memulai
              percakapan.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredPosts.map((post) => {
              const isExpanded = expandedPostIds.includes(post.id);
              const isRepliesOpen = openedRepliesPostId === post.id;
              const shouldShowReadMore = post.content.length > 170;

              return (
                <article
                  key={post.id}
                  className="rounded-[22px] bg-white p-4 shadow-[0px_3px_16px_rgba(0,0,0,0.08)]"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E6F4EA] text-[22px]">
                        {post.avatar}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate font-poppins text-[14px] font-extrabold text-black">
                          {post.name}
                        </h2>
                        <p className="mt-0.5 text-[10px] font-semibold text-[#8A8A8A]">
                          {post.time} · {post.tag}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuPostId((prev) =>
                            prev === post.id ? null : post.id
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full active:scale-95"
                        aria-label="Menu postingan"
                      >
                        <HiEllipsisHorizontal className="text-[20px]" />
                      </button>

                      {activeMenuPostId === post.id && (
                        <div className="absolute right-0 top-8 z-20 w-40 rounded-2xl bg-white p-2 shadow-xl">
                          <button
                            type="button"
                            onClick={() => handleToggleBookmark(post.id)}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-semibold hover:bg-[#F5F5F5]"
                          >
                            {post.bookmarked ? (
                              <HiBookmark />
                            ) : (
                              <HiOutlineBookmark />
                            )}
                            {post.bookmarked ? "Tersimpan" : "Simpan"}
                          </button>

                          <button
                            type="button"
                            onClick={handleReportPost}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-semibold hover:bg-[#F5F5F5]"
                          >
                            <HiFlag />
                            Laporkan
                          </button>

                          {post.ownPost && (
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.id)}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-semibold text-red-600 hover:bg-red-50"
                            >
                              <HiTrash />
                              Hapus
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="whitespace-pre-line text-[13px] leading-6 text-[#1F1F1F]">
                    {getPreviewText(post.content, isExpanded)}{" "}
                    {shouldShowReadMore && (
                      <button
                        type="button"
                        onClick={() => handleToggleExpanded(post.id)}
                        className="font-extrabold text-[#17875E]"
                      >
                        {isExpanded ? "Tutup" : "Baca Selengkapnya"}
                      </button>
                    )}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {post.reactions.map((reaction) => (
                      <button
                        key={reaction.emoji}
                        type="button"
                        onClick={() => handleToggleReaction(post.id, reaction.emoji)}
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold transition active:scale-95 ${reaction.userReacted
                          ? "bg-[#CFEDE1] text-[#12734E] ring-1 ring-[#2D936C]"
                          : "bg-[#2D936C] text-white"
                          }`}
                      >
                        {reaction.emoji} {reaction.count}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        setActiveEmojiPickerPostId((prev) =>
                          prev === post.id ? null : post.id
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F0F0F0] text-[#555] transition active:scale-95"
                      aria-label="Tambah reaksi"
                    >
                      <HiOutlineFaceSmile />
                    </button>
                  </div>

                  {activeEmojiPickerPostId === post.id && (
                    <div className="mt-3 rounded-[18px] border border-[#E8E8E8] bg-[#FAFAFA] p-3">
                      <p className="mb-2 text-[11px] font-bold text-[#777]">
                        Pilih dukungan
                      </p>

                      <div className="grid grid-cols-4 gap-2">
                        {AVAILABLE_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleToggleReaction(post.id, emoji)}
                            className="flex h-9 w-full items-center justify-center rounded-xl bg-white text-[18px] shadow-sm transition hover:bg-[#E6F4EA] active:scale-95"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenReplies(post.id)}
                    className="mt-3 flex items-center gap-1 text-[10px] font-extrabold text-[#17875E] active:scale-95"
                  >
                    <HiChatBubbleLeft />
                    {post.replies.length} balasan
                  </button>

                  {isRepliesOpen && (
                    <div className="mt-3 rounded-2xl bg-[#F6F7F7] p-3">
                      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                        {QUICK_REPLIES.map((quickReply) => (
                          <button
                            key={quickReply}
                            type="button"
                            onClick={() => handleSendReply(post.id, quickReply)}
                            className="shrink-0 rounded-full bg-white px-3 py-2 text-[10px] font-bold text-[#17875E] shadow-sm active:scale-95"
                          >
                            {quickReply}
                          </button>
                        ))}
                      </div>

                      <div className="mb-3 flex items-center gap-2 rounded-2xl bg-white px-3 py-2">
                        <input
                          value={replyDraftByPostId[post.id] ?? ""}
                          onChange={(event) =>
                            setReplyDraftByPostId((prev) => ({
                              ...prev,
                              [post.id]: event.target.value,
                            }))
                          }
                          placeholder="Tulis balasan suportif..."
                          className="min-w-0 flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#999]"
                        />

                        <button
                          type="button"
                          onClick={() => handleSendReply(post.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D936C] text-white active:scale-95 disabled:bg-[#CFCFCF]"
                          disabled={!(replyDraftByPostId[post.id] ?? "").trim()}
                          aria-label="Kirim balasan"
                        >
                          <HiPaperAirplane />
                        </button>
                      </div>

                      <div className="flex flex-col gap-2">
                        {post.replies.slice(0, 4).map((reply) => (
                          <div
                            key={reply.id}
                            className="rounded-2xl bg-white px-3 py-2"
                          >
                            <div className="mb-1 flex items-center gap-2">
                              <span className="text-[14px]">{reply.avatar}</span>
                              <p className="text-[11px] font-bold">
                                {reply.name}
                              </p>
                              <p className="text-[9px] font-semibold text-[#999]">
                                {reply.time}
                              </p>
                            </div>

                            <p className="text-[11px] leading-5 text-[#333]">
                              {reply.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {isCreatingPost && (
        <div className="fixed inset-0 z-[9999] flex items-end bg-black/40 px-0">
          <div className="flex max-h-[calc(100dvh-24px)] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl">
            <div className="shrink-0 border-b border-[#ECECEC] px-5 pb-4 pt-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-poppins text-[20px] font-extrabold">
                    Buat Postingan
                  </h2>
                  <p className="mt-1 text-[12px] leading-5 text-[#666]">
                    Bagikan cerita dengan aman dan suportif.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreatingPost(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F1F1] text-xl active:scale-95"
                  aria-label="Tutup modal"
                  disabled={isSavingPost}
                >
                  <HiXMark />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <div className="flex items-center justify-between rounded-2xl bg-[#F6F7F7] px-4 py-3">
                <div>
                  <p className="text-[13px] font-extrabold">Posting anonim</p>
                  <p className="mt-0.5 text-[11px] text-[#777]">
                    Nama kamu tidak ditampilkan.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setAnonymousPost((prev) => !prev)}
                  className={`h-7 w-12 rounded-full p-1 transition ${anonymousPost ? "bg-[#2D936C]" : "bg-[#CFCFCF]"
                    }`}
                >
                  <span
                    className={`block h-5 w-5 rounded-full bg-white transition ${anonymousPost ? "translate-x-5" : "translate-x-0"
                      }`}
                  />
                </button>
              </div>

              <div>
                <label className="text-[12px] font-extrabold">Kategori</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {FILTER_OPTIONS.filter((option) => option.key !== "semua").map(
                    (option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() =>
                          setNewPostCategory(option.key as PostCategory)
                        }
                        className={`rounded-2xl border px-3 py-3 text-left text-[12px] font-bold active:scale-95 ${newPostCategory === option.key
                          ? "border-[#2D936C] bg-[#E6F4EA] text-[#15835A]"
                          : "border-[#E5E5E5] bg-white text-[#222]"
                          }`}
                      >
                        {option.emoji} {option.label}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="text-[12px] font-extrabold">Tag</label>
                <input
                  value={newPostTag}
                  onChange={(event) => setNewPostTag(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#E5E5E5] px-4 py-3 text-[13px] outline-none focus:border-[#2D936C]"
                  placeholder="#ceritaku"
                />
              </div>

              <div>
                <label className="text-[12px] font-extrabold">
                  Isi postingan
                </label>
                <textarea
                  value={newPostContent}
                  onChange={(event) => setNewPostContent(event.target.value)}
                  placeholder="Apa yang ingin kamu bagikan ke komunitas?"
                  className="mt-2 h-40 w-full resize-none rounded-2xl border border-[#E5E5E5] px-4 py-3 text-[13px] leading-6 outline-none placeholder:text-[#999] focus:border-[#2D936C]"
                  autoFocus
                />
              </div>
            </div>

            <div className="shrink-0 border-t border-[#ECECEC] bg-white px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4">
              <button
                type="button"
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || isSavingPost}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2D936C] py-4 font-poppins text-[15px] font-extrabold text-white active:scale-[0.98] disabled:bg-[#CFCFCF]"
              >
                <HiHeart />
                {isSavingPost ? "Mengirim..." : "Kirim ke Komunitas"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-[calc(92px+env(safe-area-inset-bottom))] left-1/2 z-[10000] w-[calc(100%-40px)] -translate-x-1/2 rounded-2xl bg-[#111] px-4 py-3 text-center text-[12px] font-bold text-white shadow-xl">
          {toast}
        </div>
      )}

      <BottomNav />
    </main>
  );
}