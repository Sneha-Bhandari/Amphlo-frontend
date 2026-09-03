import BlogBanner from "../../../PageComponent/Home/blogBanner";
import BlogList from "./BlogList";

export const metadata = {
  title: "Blogs | Siddhartha International College",
  description: "Read insightful articles, industry trends, and stories from our community.",
};

export default async function BlogsPage({ searchParams }) {
  const params = await searchParams;

  return (
    <>
      <BlogBanner />
      <BlogList searchParams={params} />
    </>
  );
}