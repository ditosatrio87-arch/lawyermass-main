import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

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
      }
    };

    fetchArticle();
  }, [slug]);

  if (!article) {
    return (
      <div className="py-24 text-center">
        <p className="text-slate-500">Loading article...</p>
      </div>
    );
  }

  const imageSrc = article.image_url || article.image || null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#191919] mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Date */}
        <div className="flex items-center gap-2 text-[#AE8737] mb-8">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {new Date(article.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Image */}
        {imageSrc && (
          <img
            src={imageSrc}
            alt={article.title}
            className="w-full h-[400px] object-cover rounded-lg mb-10 shadow-sm"
          />
        )}

        {/* CONTENT */}
        <div className="text-slate-700 text-[17px] leading-relaxed">

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{

              p: ({ children }) => (
                <p className="mb-6 leading-relaxed">{children}</p>
              ),

              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold mt-10 mb-4 text-[#191919]">
                  {children}
                </h2>
              ),

              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mt-8 mb-3 text-[#191919]">
                  {children}
                </h3>
              ),

              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  {children}
                </ul>
              ),

              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-6 space-y-2">
                  {children}
                </ol>
              ),

              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),

              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-[#AE8737] underline hover:opacity-80"
                  target="_blank"
                >
                  {children}
                </a>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>

        </div>

      </div>
    </section>
  );
}