import SingleBlogClientPage from './SingleBlogClientPage'; 

// 👇 Add 'async' here
export default async function Page({ params }: { params: { slug:string } }) {
  const { slug } = params; // This will now work correctly
  
  return <SingleBlogClientPage slug={slug} />;
}