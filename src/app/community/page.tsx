"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";
import { invalidateUserCache, readUserCache, writeUserCache } from "@/lib/userCache";
import {
  Plus,
  MessageSquare,
  Smile,
  X,
  MoreHorizontal,
  Search,
  Send,
  Bookmark,
  Flag,
  Trash2,
  Heart,
} from "lucide-react";

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

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "cerita", label: "Cerita" },
  { key: "support", label: "Support" },
  { key: "darurat", label: "Darurat" },
  { key: "lokasi", label: "Lokasi" },
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

const FALLBACK_COMMUNITY_POSTS: Post[] = [
  {
    id: "fb-1",
    userId: "mock-1",
    name: "Dimas R.",
    avatar: "🌱",
    time: "25 menit lalu",
    tag: "#ceritaku",
    category: "cerita",
    content:
      "Hari ke-5 berhasil nolak dorongan saat scrolling malam. Triknya langsung taruh HP di meja kerja dan minum segelas air dingin. Rasanya jauh lebih lega!",
    reactions: [
      { emoji: "💪", count: 8, userReacted: false },
      { emoji: "🔥", count: 5, userReacted: false },
    ],
    replies: [
      {
        id: "rep-1",
        name: "Anonim",
        avatar: "🙂",
        time: "10 menit lalu",
        content: "Mantap banget, trik air dingin beneran ngebantu reset fokus!",
      },
    ],
    bookmarked: false,
    ownPost: false,
  },
  {
    id: "fb-2",
    userId: "mock-2",
    name: "Anonim Lumif",
    avatar: "🌱",
    time: "2 jam lalu",
    tag: "#support",
    category: "support",
    content:
      "Kalau lagi ngerasa kesepian atau stres berat, jangan pendam sendiri ya kawan-kawan. Komunitas ini tempat kita saling menguatkan tanpa saling menghakimi.",
    reactions: [
      { emoji: "❤️", count: 14, userReacted: true },
      { emoji: "🫂", count: 9, userReacted: false },
    ],
    replies: [],
    bookmarked: false,
    ownPost: false,
  },
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

  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("semua");
  const [sort, setSort] = useState<SortKey>("terbaru");

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

  const loadPosts = async (withLoading = true) => {
    if (withLoading) {
      setIsLoadingPosts(true);
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = user?.id ?? null;

      if (userId && !withLoading) {
        const cachedPosts = readUserCache<Post[]>(userId, "community_posts");
        if (cachedPosts) {
          setPosts(cachedPosts.data);
          setIsLoadingPosts(false);
          if (cachedPosts.isFresh) {
            return;
          }
        }
      }

      const { data: postRows, error: postError } = await supabase
        .from("community_posts")
        .select("id, user_id, author_name, tag, category, content, created_at")
        .order("created_at", { ascending: false });

      if (postError) {
        if (userId) {
          showToast("Gagal memuat feed komunitas dari server.");
        } else {
          setPosts(FALLBACK_COMMUNITY_POSTS);
        }
        setIsLoadingPosts(false);
        return;
      }

      const postsData = postRows ?? [];
      if (postsData.length === 0) {
        if (userId) {
          setPosts([]);
          writeUserCache(userId, "community_posts", []);
        } else {
          setPosts(FALLBACK_COMMUNITY_POSTS);
        }
        setIsLoadingPosts(false);
        return;
      }

      const postIds = postsData.map((post) => post.id);

      let reactionsByPost: Record<string, Reaction[]> = {};
      let repliesByPost: Record<string, Reply[]> = {};

      if (postIds.length > 0) {
        const { data: reactionRows, error: reactionError } = await supabase
          .from("community_reactions")
          .select("id, post_id, user_id, emoji, created_at")
          .in("post_id", postIds);

        if (!reactionError && reactionRows) {
          reactionsByPost = groupReactionsByPost(reactionRows, userId);
        }

        const { data: replyRows, error: replyError } = await supabase
          .from("community_replies")
          .select("id, post_id, user_id, author_name, content, created_at")
          .in("post_id", postIds)
          .order("created_at", { ascending: false });

        if (!replyError && replyRows) {
          repliesByPost = groupRepliesByPost(replyRows);
        }
      }

      const mappedPosts = postsData.map((row) =>
        mapRowToPost(row, userId, reactionsByPost, repliesByPost)
      );
      setPosts(mappedPosts);
      if (userId) {
        writeUserCache(userId, "community_posts", mappedPosts);
      }

      setIsLoadingPosts(false);
    } catch (err) {
      console.warn("Supabase loadPosts error:", err);
      setPosts([]);
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchInitialPosts = async () => {
      if (!isMounted) return;
      await loadPosts(false);
    };

    fetchInitialPosts();

    return () => {
      isMounted = false;
    };
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

    invalidateUserCache(user.id, "community_posts");
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
      } else {
        invalidateUserCache(user.id, "community_posts");
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
    } else {
      invalidateUserCache(user.id, "community_posts");
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

    invalidateUserCache(undefined, "community_posts");
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

    invalidateUserCache(user.id, "community_posts");
    showToast("Balasan dikirim 🌱");
  };

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-card/95 px-4 py-4 backdrop-blur-md md:px-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-muted-foreground">
              Ruang aman bersama
            </p>
            <h1 className="mt-0.5 font-heading text-xl font-bold tracking-tight text-foreground md:text-2xl">
              Interaksi Komunitas
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuery((prev) => (prev ? "" : " "))}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-xs transition hover:bg-muted"
              aria-label="Cari postingan"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setIsCreatingPost(true)}
              className="hidden min-h-[44px] items-center gap-2 rounded-xl bg-primary px-4 font-heading text-xs font-bold text-primary-foreground shadow-xs transition hover:bg-primary-dark md:flex"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Tulis Cerita</span>
            </button>
          </div>
        </div>

        {query !== "" && (
          <div className="mx-auto mt-3 flex h-11 w-full max-w-6xl items-center gap-2 rounded-xl border border-input bg-background px-3.5 focus-within:ring-2 focus-within:ring-ring">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama, tag, atau cerita..."
              className="w-full bg-transparent text-sm text-foreground focus:outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Bersihkan pencarian"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 px-4 pb-[calc(140px+env(safe-area-inset-bottom))] pt-5 md:px-8 md:pb-10">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Filters & Sort Column */}
          <aside className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-heading text-sm font-bold text-card-foreground">
                  Kategori
                </h2>
                <span className="rounded-lg bg-primary-light px-2.5 py-1 text-xs font-bold text-primary">
                  {filteredPosts.length} postingan
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setFilter(option.key)}
                    aria-pressed={filter === option.key}
                    className={`min-h-[40px] rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                      filter === option.key
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-surface-soft text-foreground hover:bg-muted"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  Urutkan berdasarkan
                </p>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setSort(option.key)}
                      aria-pressed={sort === option.key}
                      className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                        sort === option.key
                          ? "bg-primary-light text-primary"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Feed Column */}
          <section className="lg:col-span-8">
            {isLoadingPosts ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm font-medium text-muted-foreground shadow-xs">
                Memuat komunitas...
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
                <MessageSquare
                  className="mx-auto h-10 w-10 text-primary"
                  aria-hidden="true"
                />
                <h2 className="mt-3 font-heading text-base font-bold text-card-foreground">
                  Belum ada postingan
                </h2>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Coba filter lain atau jadilah orang pertama yang memulai percakapan.
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
                      className="rounded-2xl border border-border bg-card p-5 shadow-xs"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-lg font-bold text-primary">
                            {post.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate font-heading text-sm font-bold text-card-foreground">
                              {post.name}
                            </h2>
                            <p className="mt-0.5 text-xs text-muted-foreground">
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
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            aria-label="Menu postingan"
                            aria-expanded={activeMenuPostId === post.id}
                          >
                            <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
                          </button>

                          {activeMenuPostId === post.id && (
                            <div className="absolute right-0 top-10 z-20 w-44 rounded-2xl border border-border bg-card p-2 shadow-xl">
                              <button
                                type="button"
                                onClick={() => handleToggleBookmark(post.id)}
                                className="flex min-h-[40px] w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-card-foreground hover:bg-muted"
                              >
                                <Bookmark
                                  className={`h-4 w-4 ${post.bookmarked ? "fill-primary text-primary" : ""}`}
                                  aria-hidden="true"
                                />
                                {post.bookmarked ? "Tersimpan" : "Simpan"}
                              </button>

                              <button
                                type="button"
                                onClick={handleReportPost}
                                className="flex min-h-[40px] w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-card-foreground hover:bg-muted"
                              >
                                <Flag className="h-4 w-4" aria-hidden="true" />
                                Laporkan
                              </button>

                              {post.ownPost && (
                                <button
                                  type="button"
                                  onClick={() => handleDeletePost(post.id)}
                                  className="flex min-h-[40px] w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                                  Hapus
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="whitespace-pre-line text-sm leading-relaxed text-card-foreground">
                        {getPreviewText(post.content, isExpanded)}{" "}
                        {shouldShowReadMore && (
                          <button
                            type="button"
                            onClick={() => handleToggleExpanded(post.id)}
                            className="font-bold text-primary hover:underline"
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
                            onClick={() =>
                              handleToggleReaction(post.id, reaction.emoji)
                            }
                            aria-pressed={reaction.userReacted}
                            className={`flex min-h-[32px] items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition ${
                              reaction.userReacted
                                ? "bg-primary-light text-primary ring-1 ring-primary"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            <span>{reaction.emoji}</span>
                            <span>{reaction.count}</span>
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() =>
                            setActiveEmojiPickerPostId((prev) =>
                              prev === post.id ? null : post.id
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-primary-light hover:text-primary"
                          aria-label="Tambah reaksi"
                        >
                          <Smile className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      {activeEmojiPickerPostId === post.id && (
                        <div className="mt-3 rounded-2xl border border-border bg-surface-soft p-3">
                          <p className="mb-2 text-xs font-bold text-muted-foreground">
                            Pilih dukungan
                          </p>

                          <div className="grid grid-cols-4 gap-2">
                            {AVAILABLE_EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() =>
                                  handleToggleReaction(post.id, emoji)
                                }
                                className="flex h-10 w-full items-center justify-center rounded-xl bg-card text-lg shadow-xs transition hover:bg-primary-light"
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
                        aria-expanded={isRepliesOpen}
                        className="mt-3 flex min-h-[36px] items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                      >
                        <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                        {post.replies.length} balasan
                      </button>

                      {isRepliesOpen && (
                        <div className="mt-3 rounded-2xl bg-surface-soft p-3.5">
                          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                            {QUICK_REPLIES.map((quickReply) => (
                              <button
                                key={quickReply}
                                type="button"
                                onClick={() =>
                                  handleSendReply(post.id, quickReply)
                                }
                                className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-xs hover:bg-primary-light"
                              >
                                {quickReply}
                              </button>
                            ))}
                          </div>

                          <div className="mb-3 flex items-center gap-2 rounded-xl border border-input bg-card px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
                            <input
                              value={replyDraftByPostId[post.id] ?? ""}
                              onChange={(event) =>
                                setReplyDraftByPostId((prev) => ({
                                  ...prev,
                                  [post.id]: event.target.value,
                                }))
                              }
                              placeholder="Tulis balasan suportif..."
                              className="min-w-0 flex-1 bg-transparent text-xs text-foreground focus:outline-none"
                            />

                            <button
                              type="button"
                              onClick={() => handleSendReply(post.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
                              disabled={!(replyDraftByPostId[post.id] ?? "").trim()}
                              aria-label="Kirim balasan"
                            >
                              <Send className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>

                          <div className="flex flex-col gap-2">
                            {post.replies.slice(0, 4).map((reply) => (
                              <div
                                key={reply.id}
                                className="rounded-xl border border-border/60 bg-card px-3 py-2.5"
                              >
                                <div className="mb-1 flex items-center gap-2">
                                  <p className="text-xs font-bold text-card-foreground">
                                    {reply.name}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground">
                                    {reply.time}
                                  </p>
                                </div>

                                <p className="text-xs leading-5 text-muted-foreground">
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
        </div>
      </main>

      <button
        type="button"
        onClick={() => setIsCreatingPost(true)}
        className="fixed bottom-[calc(92px+env(safe-area-inset-bottom))] right-5 z-[80] flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-primary px-5 font-heading text-sm font-bold text-primary-foreground shadow-lg transition hover:bg-primary-dark md:hidden"
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
        Tulis
      </button>

      {isCreatingPost && (
        <div
          className="fixed inset-0 z-[9999] flex items-end bg-black/50 p-0 md:items-center md:justify-center md:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-post-title"
        >
          <div className="flex max-h-[calc(100dvh-24px)] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border bg-card text-card-foreground shadow-2xl md:rounded-3xl">
            <div className="shrink-0 border-b border-border px-5 pb-4 pt-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 id="create-post-title" className="font-heading text-lg font-bold">
                    Buat Postingan
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Bagikan cerita dengan aman dan suportif.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreatingPost(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground"
                  aria-label="Tutup modal"
                  disabled={isSavingPost}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <div className="flex items-center justify-between rounded-2xl bg-surface-soft px-4 py-3">
                <div>
                  <p className="text-sm font-bold">Posting anonim</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Nama kamu tidak ditampilkan.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={anonymousPost}
                  aria-label="Posting anonim"
                  onClick={() => setAnonymousPost((prev) => !prev)}
                  className={`h-7 w-12 rounded-full p-1 transition ${
                    anonymousPost ? "bg-primary" : "bg-muted-foreground/40"
                  }`}
                >
                  <span
                    className={`block h-5 w-5 rounded-full bg-white transition ${
                      anonymousPost ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div>
                <p className="text-xs font-bold">Kategori</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {FILTER_OPTIONS.filter(
                    (option) => option.key !== "semua"
                  ).map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() =>
                        setNewPostCategory(option.key as PostCategory)
                      }
                      className={`min-h-[44px] rounded-xl border px-3 py-2 text-left text-xs font-bold ${
                        newPostCategory === option.key
                          ? "border-primary bg-primary-light text-primary"
                          : "border-border bg-card text-card-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-xs font-bold">Tag</span>
                <input
                  value={newPostTag}
                  onChange={(event) => setNewPostTag(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground"
                  placeholder="#ceritaku"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold">Isi postingan</span>
                <textarea
                  value={newPostContent}
                  onChange={(event) => setNewPostContent(event.target.value)}
                  placeholder="Apa yang ingin kamu bagikan ke komunitas?"
                  className="mt-2 h-36 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm leading-6 text-foreground"
                  autoFocus
                />
              </label>
            </div>

            <div className="shrink-0 border-t border-border bg-card px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4">
              <button
                type="button"
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || isSavingPost}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary font-heading text-sm font-bold text-primary-foreground disabled:opacity-40"
              >
                <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
                {isSavingPost ? "Mengirim..." : "Kirim ke Komunitas"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-[calc(92px+env(safe-area-inset-bottom))] left-1/2 z-[10000] w-[calc(100%-40px)] max-w-sm -translate-x-1/2 rounded-2xl bg-[#111827] px-4 py-3 text-center text-xs font-bold text-white shadow-xl md:bottom-6"
        >
          {toast}
        </div>
      )}

      <BottomNav />
    </div>
  );
}