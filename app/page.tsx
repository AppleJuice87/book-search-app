import BookSearch from '@/components/BookSearch';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">도서 검색 앱</h1>
      <BookSearch />
    </div>
  );
}
