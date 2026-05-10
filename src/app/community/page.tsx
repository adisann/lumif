"use client";

import { useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
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

type Reaction = {
  emoji: string;
  count: number;
  userReacted?: boolean;
};

type Reply = {
  id: number;
  name: string;
  time: string;
  content: string;
  avatar: string;
};

type PostCategory = "cerita" | "support" | "darurat" | "lokasi";

type Post = {
  id: number;
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

type FilterKey = "semua" | PostCategory;
type SortKey = "terbaru" | "populer" | "ramai";

const FILTER_OPTIONS: { key: FilterKey; label: string; emoji: string }[] = [
  { key: "semua", label: "Semua", emoji: "🌱" },
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

const AVAILABLE_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🙌", "💪", "🌱"];

const QUICK_REPLIES = [
  "Semangat, kamu nggak sendiri 🌱",
  "Aku dukung kamu. Pelan-pelan ya 🤝",
  "Terima kasih sudah berani cerita 🙌",
  "Tarik napas dulu, kamu aman sekarang 💚",
];

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    name: "John Doe",
    avatar: "🧑‍🦱",
    time: "8 jam lalu",
    tag: "#health",
    category: "cerita",
    content:
      "Aku berhasil melewati 3 bulan setelah aku terakhir PMO, rasanya seperti perjalanan melampaui neraka tapi aku berhasil. Aku tidak sabar untuk mencapai runtutan 6 bulan pertama aku di aplikasi ini. Terima kasih untuk orang-orang yang sudah support saya hingga saat ini, love you all ❤️",
    reactions: [
      { emoji: "👍", count: 4 },
      { emoji: "❤️", count: 2 },
      { emoji: "🔥", count: 10 },
    ],
    replies: [
      { id: 101, name: "Nara", time: "7 jam lalu", avatar: "🌼", content: "Bangga banget sama progresmu. Lanjut pelan-pelan ya." },
      { id: 102, name: "Raka", time: "6 jam lalu", avatar: "🦊", content: "3 bulan itu besar. Terima kasih sudah jadi inspirasi." },
      { id: 103, name: "Mika", time: "5 jam lalu", avatar: "🐼", content: "Keren, tetap jaga rutinitasmu." },
      { id: 104, name: "Dian", time: "4 jam lalu", avatar: "🦁", content: "Kamu bisa sampai 6 bulan." },
      { id: 105, name: "Bimo", time: "3 jam lalu", avatar: "🐻", content: "Respect." },
      { id: 106, name: "Luna", time: "2 jam lalu", avatar: "🌙", content: "Semoga makin kuat." },
      { id: 107, name: "Adit", time: "1 jam lalu", avatar: "🦉", content: "Mantap." },
    ],
  },
  {
    id: 2,
    name: "Gandi",
    avatar: "🦅",
    time: "2 hari lalu",
    tag: "#care",
    category: "support",
    content:
      "Kemarin runtutanku pecah 😣, aku merasa gagal mempertahankan runtutan yang aku bangun selama 2 tahun ini, tapi mulai besok aku yakin tidak akan gagal lagi. Doakan saya teman teman 😊!",
    reactions: [
      { emoji: "😮", count: 6 },
      { emoji: "❤️", count: 7 },
      { emoji: "💪", count: 3 },
    ],
    replies: [
      { id: 201, name: "Reno", time: "1 hari lalu", avatar: "🧢", content: "Relapse bukan akhir. Evaluasi trigger-nya, lalu lanjut lagi." },
      { id: 202, name: "Sari", time: "1 hari lalu", avatar: "🌻", content: "Kamu sudah punya bukti bisa bertahan lama. Mulai lagi dari hari ini." },
    ],
  },
  {
    id: 3,
    name: "Rahmat",
    avatar: "🧑",
    time: "1 jam lalu",
    tag: "#pastibisa",
    category: "cerita",
    content:
      "Awalnya aku dapat aplikasi ini dari searching di Google, karena penasaran aku iseng pakai selama 3 hari. Setelah 2 minggu aku kecanduan pakai aplikasi ini. Benar-benar mengubah hidupku.",
    reactions: [
      { emoji: "👍", count: 8 },
      { emoji: "😊", count: 7 },
    ],
    replies: [],
  },
  {
    id: 4,
    name: "Budi",
    avatar: "🧑‍🦲",
    time: "2 menit lalu",
    tag: "#surabaya",
    category: "lokasi",
    content:
      "Tim yang bagus dan komunitas yang hebat. Aku penasaran apa ada yang dari Surabaya? Bisa kenalan dengan aku.",
    reactions: [{ emoji: "👋", count: 8 }],
    replies: [],
  },
  {
    id: 5,
    name: "Kisame",
    avatar: "🐺",
    time: "9 jam lalu",
    tag: "#satupersen",
    category: "cerita",
    content:
      "Dulu aku pernah sekolah di dekat rumah katakanlah sekolah A, waktu itu aku masih SD dan belum tau apa-apa tentang dunia. Nilai anjlok, sering dibully, orang tua bertengkar, dan aku mulai mencari pelarian. Sekarang aku belajar bahwa pulih itu proses panjang, bukan perlombaan. Dari semua masalah itu aku diperlakukan sama oleh komunitas ini, tanpa dihakimi.",
    reactions: [
      { emoji: "😱", count: 10 },
      { emoji: "💔", count: 3 },
    ],
    replies: Array.from({ length: 67 }, (_, index) => ({
      id: 500 + index,
      name: `Teman ${index + 1}`,
      time: "hari ini",
      avatar: "🌱",
      content: "Terima kasih sudah cerita. Aku ikut mendukungmu.",
    })),
  },
  {
    id: 6,
    name: "Madara",
    avatar: "🧙",
    time: "1 minggu lalu",
    tag: "#Lumif4life",
    category: "support",
    content:
      "Aku rasa komunitas ini sangat membantu untuk aku yang butuh sekali support dari orang untuk mendistraksi diri dari rasa relapse. Aku tidak sangka bakal menjadi salah satu jumping stone terbesar aku tahun ini dan menjadi mimpi besarku.",
    reactions: [
      { emoji: "🔥", count: 10 },
      { emoji: "✊", count: 3 },
      { emoji: "😂", count: 3 },
    ],
    replies: Array.from({ length: 10 }, (_, index) => ({
      id: 600 + index,
      name: `Supporter ${index + 1}`,
      time: "minggu ini",
      avatar: "💚",
      content: "Tetap lanjut. Satu hari bersih tetap berarti.",
    })),
  },
];

function getTotalReactions(post: Post) {
  return post.reactions.reduce((total, reaction) => total + reaction.count, 0);
}

function getPreviewText(content: string, expanded: boolean) {
  if (expanded || content.length <= 170) return content;
  return `${content.slice(0, 170).trim()}...`;
}

export default function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("semua");
  const [sort, setSort] = useState<SortKey>("terbaru");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSortPanel, setShowSortPanel] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTag, setNewPostTag] = useState("#ceritaku");
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>("cerita");
  const [anonymousPost, setAnonymousPost] = useState(true);
  const [activeEmojiPickerPostId, setActiveEmojiPickerPostId] = useState<number | null>(null);
  const [activeMenuPostId, setActiveMenuPostId] = useState<number | null>(null);
  const [expandedPostIds, setExpandedPostIds] = useState<number[]>([]);
  const [openedRepliesPostId, setOpenedRepliesPostId] = useState<number | null>(null);
  const [replyDraftByPostId, setReplyDraftByPostId] = useState<Record<number, string>>({});
  const [toast, setToast] = useState("");

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
      return [...result].sort((a, b) => getTotalReactions(b) - getTotalReactions(a));
    }

    if (sort === "ramai") {
      return [...result].sort((a, b) => b.replies.length - a.replies.length);
    }

    return result;
  }, [filter, posts, query, sort]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  const handleCreatePost = () => {
    const content = newPostContent.trim();
    const tag = newPostTag.trim().startsWith("#") ? newPostTag.trim() : `#${newPostTag.trim()}`;

    if (!content) return;

    const newPost: Post = {
      id: Date.now(),
      name: anonymousPost ? "Anonim Lumif" : "Kamu",
      avatar: anonymousPost ? "🌱" : "🙂",
      time: "Baru saja",
      tag: tag || "#ceritaku",
      category: newPostCategory,
      content,
      reactions: [],
      replies: [],
      ownPost: true,
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent("");
    setNewPostTag("#ceritaku");
    setNewPostCategory("cerita");
    setAnonymousPost(true);
    setIsCreatingPost(false);
    showToast("Postingan berhasil dikirim 🌱");
  };

  const handleToggleReaction = (postId: number, emoji: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        const existingReactionIndex = post.reactions.findIndex((reaction) => reaction.emoji === emoji);
        const updatedReactions = post.reactions.map((reaction) => ({ ...reaction }));

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
          updatedReactions.push({ emoji, count: 1, userReacted: true });
        }

        return { ...post, reactions: updatedReactions };
      })
    );

    setActiveEmojiPickerPostId(null);
  };

  const handleToggleExpanded = (postId: number) => {
    setExpandedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleToggleBookmark = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post))
    );
    setActiveMenuPostId(null);
  };

  const handleDeletePost = (postId: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
    setActiveMenuPostId(null);
    showToast("Postingan kamu dihapus");
  };

  const handleReportPost = () => {
    setActiveMenuPostId(null);
    showToast("Laporan diterima. Terima kasih sudah menjaga komunitas.");
  };

  const handleOpenReplies = (postId: number) => {
    setOpenedRepliesPostId((prev) => (prev === postId ? null : postId));
  };

  const handleSendReply = (postId: number, forcedText?: string) => {
    const content = (forcedText ?? replyDraftByPostId[postId] ?? "").trim();
    if (!content) return;

    const newReply: Reply = {
      id: Date.now(),
      name: "Kamu",
      avatar: "🙂",
      time: "Baru saja",
      content,
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, replies: [newReply, ...post.replies] } : post
      )
    );

    setReplyDraftByPostId((prev) => ({ ...prev, [postId]: "" }));
    setOpenedRepliesPostId(postId);
  };

  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#FAFAFA] font-lexend text-black">
      <header className="shrink-0 bg-white px-4 pb-3 pt-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Avatar komunitas"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9BD4F7] text-2xl active:scale-95"
          >
            🐻
          </button>

          <h1 className="flex-1 text-center font-poppins text-[20px] font-extrabold tracking-[-0.5px]">
            Interaksi Komunitas
          </h1>

          <button
            type="button"
            onClick={() => setQuery((prev) => (prev ? "" : " "))}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl active:scale-95"
            aria-label="Cari postingan"
          >
            <HiMagnifyingGlass />
          </button>
        </div>

        {query !== "" && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3">
            <HiMagnifyingGlass className="text-[#7A7A7A]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama, tag, atau cerita..."
              className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#9A9A9A]"
              autoFocus
            />
            <button type="button" onClick={() => setQuery("")} className="text-[#7A7A7A]">
              <HiXMark />
            </button>
          </div>
        )}
      </header>

      <section className="relative z-20 flex shrink-0 items-center justify-between bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => setIsCreatingPost(true)}
          className="flex items-center gap-1 rounded-full bg-[#2D936C] px-4 py-2 text-[12px] font-bold text-white active:scale-95"
        >
          <HiPlus className="text-[14px]" /> Post
        </button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowFilterPanel((prev) => !prev);
                setShowSortPanel(false);
              }}
              className="flex items-center gap-2 rounded-full bg-[#2D936C] px-4 py-2 text-[12px] font-bold text-white active:scale-95"
            >
              <HiFunnel /> Filter <HiChevronDown />
            </button>

            {showFilterPanel && (
              <div className="absolute right-0 top-11 w-44 rounded-2xl border border-[#E5E5E5] bg-white p-2 shadow-xl">
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => {
                      setFilter(option.key);
                      setShowFilterPanel(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-semibold ${filter === option.key ? "bg-[#E6F4EA] text-[#15835A]" : "text-[#1F1F1F] hover:bg-[#F5F5F5]"
                      }`}
                  >
                    <span>{option.emoji}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowSortPanel((prev) => !prev);
                setShowFilterPanel(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2D936C] text-white active:scale-95"
              aria-label="Urutkan postingan"
            >
              <HiChevronDown />
            </button>

            {showSortPanel && (
              <div className="absolute right-0 top-11 w-44 rounded-2xl border border-[#E5E5E5] bg-white p-2 shadow-xl">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => {
                      setSort(option.key);
                      setShowSortPanel(false);
                    }}
                    className={`w-full rounded-xl px-3 py-2 text-left text-[12px] font-semibold ${sort === option.key ? "bg-[#E6F4EA] text-[#15835A]" : "text-[#1F1F1F] hover:bg-[#F5F5F5]"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="flex-1 overflow-y-auto pb-[calc(104px+env(safe-area-inset-bottom))]">
        {filteredPosts.length === 0 ? (
          <div className="mx-6 mt-12 rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-4xl">🔎</p>
            <h2 className="mt-3 font-poppins text-lg font-extrabold">Belum ada postingan</h2>
            <p className="mt-2 text-[13px] leading-6 text-[#666]">
              Coba filter lain atau jadilah orang pertama yang memulai percakapan.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isExpanded = expandedPostIds.includes(post.id);
            const isRepliesOpen = openedRepliesPostId === post.id;
            const shouldShowReadMore = post.content.length > 170;

            return (
              <article key={post.id} className="border-b border-[#DADADA] bg-white px-3 py-4">
                <div className="flex items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E6F2FF] text-[17px]">
                    {post.avatar}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 pr-7">
                      <h2 className="truncate font-poppins text-[13px] font-extrabold leading-none">{post.name}</h2>
                      <span className="shrink-0 text-[7px] font-medium text-[#8F8F8F]">{post.time}</span>
                      <span className="rounded-full bg-[#DDF1E9] px-1.5 py-0.5 text-[8px] font-bold text-[#26946A]">
                        {post.tag}
                      </span>
                    </div>

                    <p className="mt-1.5 text-[11.5px] leading-[1.45] tracking-[-0.1px] text-[#141414]">
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

                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
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
                          <span>{reaction.emoji}</span>
                          <span>{reaction.count}</span>
                        </button>
                      ))}

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveEmojiPickerPostId((prev) => (prev === post.id ? null : post.id))
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F0F0F0] text-[#555] active:scale-95"
                          aria-label="Tambah reaksi"
                        >
                          <HiOutlineFaceSmile className="text-[14px]" />
                        </button>

                        {activeEmojiPickerPostId === post.id && (
                          <div className="absolute left-0 top-8 z-30 grid w-[180px] grid-cols-5 gap-1 rounded-2xl border border-[#E5E5E5] bg-white p-2 shadow-xl">
                            {AVAILABLE_EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => handleToggleReaction(post.id, emoji)}
                                className="flex h-8 w-8 items-center justify-center rounded-xl text-lg hover:bg-[#F4F4F4] active:scale-95"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenReplies(post.id)}
                      className="mt-2 flex items-center gap-1 text-[10px] font-extrabold text-[#17875E] active:scale-95"
                    >
                      <HiChatBubbleLeft /> {post.replies.length} balasan
                    </button>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveMenuPostId((prev) => (prev === post.id ? null : post.id))}
                      className="flex h-7 w-7 items-center justify-center rounded-full active:scale-95"
                      aria-label="Menu postingan"
                    >
                      <HiEllipsisHorizontal className="text-[20px]" />
                    </button>

                    {activeMenuPostId === post.id && (
                      <div className="absolute right-0 top-8 z-30 w-40 rounded-2xl border border-[#E5E5E5] bg-white p-2 shadow-xl">
                        <button
                          type="button"
                          onClick={() => handleToggleBookmark(post.id)}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-semibold hover:bg-[#F5F5F5]"
                        >
                          {post.bookmarked ? <HiBookmark /> : <HiOutlineBookmark />}
                          {post.bookmarked ? "Tersimpan" : "Simpan"}
                        </button>
                        <button
                          type="button"
                          onClick={handleReportPost}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-semibold hover:bg-[#F5F5F5]"
                        >
                          <HiFlag /> Laporkan
                        </button>
                        {post.ownPost && (
                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id)}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-semibold text-red-600 hover:bg-red-50"
                          >
                            <HiTrash /> Hapus
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {isRepliesOpen && (
                  <div className="ml-9 mt-4 rounded-3xl bg-[#F7F7F7] p-3">
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

                    <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2">
                      <input
                        value={replyDraftByPostId[post.id] ?? ""}
                        onChange={(event) =>
                          setReplyDraftByPostId((prev) => ({ ...prev, [post.id]: event.target.value }))
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

                    <div className="mt-3 space-y-3">
                      {post.replies.slice(0, 4).map((reply) => (
                        <div key={reply.id} className="flex gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-base">
                            {reply.avatar}
                          </div>
                          <div className="min-w-0 flex-1 rounded-2xl bg-white px-3 py-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-extrabold">{reply.name}</span>
                              <span className="text-[8px] text-[#888]">{reply.time}</span>
                            </div>
                            <p className="mt-1 text-[11px] leading-5 text-[#333]">{reply.content}</p>
                          </div>
                        </div>
                      ))}

                      {post.replies.length > 4 && (
                        <p className="text-center text-[10px] font-bold text-[#17875E]">
                          +{post.replies.length - 4} balasan lainnya
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>

      {isCreatingPost && (
        <div className="fixed inset-0 z-[9999] flex items-end bg-black/40">
          <div className="flex max-h-[calc(100dvh-24px)] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#ECECEC] px-5 py-4">
              <div>
                <h2 className="font-poppins text-[17px] font-extrabold">Buat Postingan</h2>
                <p className="mt-1 text-[11px] text-[#777]">Bagikan cerita dengan aman dan suportif.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingPost(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F1F1] text-xl active:scale-95"
                aria-label="Tutup modal"
              >
                <HiXMark />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <div className="flex items-center justify-between rounded-2xl bg-[#E6F4EA] px-4 py-3">
                <div>
                  <p className="text-[12px] font-extrabold text-[#15835A]">Posting anonim</p>
                  <p className="mt-0.5 text-[10px] text-[#327E62]">Nama kamu tidak ditampilkan.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAnonymousPost((prev) => !prev)}
                  className={`h-7 w-12 rounded-full p-1 transition ${anonymousPost ? "bg-[#2D936C]" : "bg-[#CFCFCF]"}`}
                >
                  <span
                    className={`block h-5 w-5 rounded-full bg-white transition ${anonymousPost ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>

              <div>
                <label className="text-[12px] font-extrabold">Kategori</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {FILTER_OPTIONS.filter((option) => option.key !== "semua").map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setNewPostCategory(option.key as PostCategory)}
                      className={`rounded-2xl border px-3 py-3 text-left text-[12px] font-bold active:scale-95 ${newPostCategory === option.key
                          ? "border-[#2D936C] bg-[#E6F4EA] text-[#15835A]"
                          : "border-[#E5E5E5] bg-white text-[#222]"
                        }`}
                    >
                      <span className="mr-1">{option.emoji}</span> {option.label}
                    </button>
                  ))}
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
                <label className="text-[12px] font-extrabold">Isi postingan</label>
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
                disabled={!newPostContent.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2D936C] py-4 font-poppins text-[15px] font-extrabold text-white active:scale-[0.98] disabled:bg-[#CFCFCF]"
              >
                <HiHeart /> Kirim ke Komunitas
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
