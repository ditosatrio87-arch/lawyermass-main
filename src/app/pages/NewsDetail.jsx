import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Calendar, Clock, ArrowUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";

export function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error(error);
      } else {
        setArticle(data);
fetchRelated(data);
      }
    };

    fetchArticle();
  }, [slug]);

  if (!article) {
    return (
      <div className="py-32 text-center">
        <p className="text-slate-500">Loading article...</p>
      </div>
    );
  }

const [relatedNews, setRelatedNews] = useState([]);
const fetchRelated = async (currentArticle) => {
  if (!currentArticle) return;

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .neq("id", currentArticle.id) // exclude artikel sekarang
    .eq("status", "Published")
    .limit(3);

  if (error) {
    console.error(error);
  } else {
    setRelatedNews(data);
  }
};
  const imageSrc = article.image_url || article.image || null;

  // reading time
  const words = article.content?.split(" ").length || 0;
  const readingTime = Math.ceil(words / 200);

  return (
    <section className="bg-white py-20">

      <div className="max-w-3xl mx-auto px-6">

        {/* CATEGORY */}
        {article.category && (
          <div className="mb-6">
            <span className="text-xs tracking-widest uppercase font-semibold text-[#AE8737] bg-[#AE8737]/10 px-3 py-1 rounded-full">
              {article.category}
            </span>
          </div>
        )}

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#191919] leading-tight mb-6">
          {article.title}
        </h1>

        {/* META */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-10">

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#AE8737]" />
            {new Date(article.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#AE8737]" />
            {readingTime} min read
          </div>

        </div>

        {/* HERO IMAGE */}
        {imageSrc && (
          <div className="mb-12 overflow-hidden rounded-xl shadow-sm">
            <img
              src={imageSrc}
              alt={article.title}
              className="w-full h-[420px] object-cover"
            />
          </div>
        )}

        {/* ARTICLE BODY */}
        <article className="text-[18px] leading-relaxed text-slate-700">

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{

              p: ({ children }) => (
                <p className="mb-4">{children}</p>
              ),

              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold mt-10 mb-3 text-[#191919]">
                  {children}
                </h2>
              ),

              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mt-8 mb-2 text-[#191919]">
                  {children}
                </h3>
              ),

              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  {children}
                </ul>
              ),

              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-4 space-y-1">
                  {children}
                </ol>
              ),

              li: ({ children }) => (
                <li className="leading-relaxed [&>p]:mb-0">
                  {children}
                </li>
              ),

              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-[#AE8737] underline hover:opacity-80"
                  target="_blank"
                  rel="noreferrer"
                >
                  {children}
                </a>
              ),

              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[#AE8737] pl-4 italic my-6 text-slate-600">
                  {children}
                </blockquote>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>

        </article>
{/* RELATED NEWS */}
<div className="mt-20">
  <h3 className="text-2xl font-bold mb-6 text-[#191919]">
    Artikel Lainnya
  </h3>

  <div className="grid md:grid-cols-3 gap-6">
    {relatedNews.map((item) => (
      <Link
        key={item.id}
        to={`/news/${item.slug}`}
        className="group border rounded-xl overflow-hidden hover:shadow-lg transition"
      >
        <div className="h-40 overflow-hidden">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        </div>

        <div className="p-4">
          <h4 className="font-semibold text-sm text-[#191919] group-hover:text-[#AE8737] line-clamp-2">
            {item.title}
          </h4>
        </div>
      </Link>
    ))}
  </div>
</div>

      {/* SCROLL TO TOP BUTTON */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-[#AE8737] hover:bg-[#8F6D2C] text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </section>
  );
}
