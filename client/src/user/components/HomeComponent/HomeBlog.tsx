import { Link } from "react-router-dom";
import { ArrowRight, Eye, FileText } from "lucide-react";
import { CATEGORY_STYLE } from "./homeConstants";

interface Props {
  blogs: any[];
}

const HomeBlog: React.FC<Props> = ({ blogs }) => {
  const featuredBlog = blogs[0] ?? null;
  const sideBlogs = blogs.slice(1, 4);

  return (
    <section className="py-14 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-violet-400 text-sm font-semibold uppercase tracking-wider">
              Bài viết
            </span>
            <h2 className="text-4xl font-black text-white mt-1">
              Kiến thức &<br />
              <span className="text-violet-400">Kinh nghiệm học tập</span>
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-violet-400 font-semibold hover:gap-3 transition-all text-sm"
          >
            Tất cả bài viết
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 h-80 bg-slate-800 rounded-2xl animate-pulse" />
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((k) => (
                <div
                  key={k}
                  className="h-36 bg-slate-800 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            {/* Featured blog — tall card */}
            {featuredBlog && (
              <Link
                to={`/blog/${featuredBlog.slug}`}
                className="lg:col-span-2 group relative rounded-2xl overflow-hidden min-h-[320px] flex flex-col justify-end hover:shadow-2xl transition-shadow"
              >
                {featuredBlog.blog_thumbnail ? (
                  <img
                    src={featuredBlog.blog_thumbnail}
                    alt={featuredBlog.blog_title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-blue-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                <div className="relative p-6">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-3 ${CATEGORY_STYLE[featuredBlog.category] ?? "bg-violet-100 text-violet-700"}`}
                  >
                    {featuredBlog.category}
                  </span>
                  <h3 className="text-xl font-black text-white mb-2 leading-tight group-hover:text-violet-300 transition-colors line-clamp-3">
                    {featuredBlog.blog_title}
                  </h3>
                  <div className="flex items-center gap-3 text-slate-400 text-xs">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />{" "}
                      {featuredBlog.views_count ?? 0} lượt xem
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />{" "}
                      {featuredBlog.User?.user_name ?? "Admin"}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Side blog grid */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sideBlogs.map((post) => (
                <Link
                  to={`/blog/${post.slug}`}
                  key={post.blog_id}
                  className="group bg-slate-800 hover:bg-slate-750 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-all hover:-translate-y-0.5"
                >
                  {post.blog_thumbnail && (
                    <img
                      src={post.blog_thumbnail}
                      alt={post.blog_title}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2 ${CATEGORY_STYLE[post.category] ?? "bg-violet-100 text-violet-700"}`}
                    >
                      {post.category}
                    </span>
                    <h4 className="text-slate-100 font-bold text-sm leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors mb-2">
                      {post.blog_title}
                    </h4>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Eye className="w-3 h-3" />
                      {post.views_count ?? 0} lượt xem
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeBlog;
