import React from "react";
import { Outlet } from "react-router-dom";
import BlogLayout from "../components/BlogComponent/BlogLayout";
import { useBlog } from "../contexts/blogContext";

const BlogLayoutPage: React.FC = () => {
  const { fetchBlogsPaginated } = useBlog();

  const handleSearch = (searchTerm: string) => {
    fetchBlogsPaginated(searchTerm, 1, 9, undefined, "created_at", "DESC");
  };

  return (
    <BlogLayout onSearch={handleSearch}>
      <Outlet />
    </BlogLayout>
  );
};

export default BlogLayoutPage;
