import HeroSection from '@/components/HeroSection'
import BookCard from '@/components/BookCard'
import Search from '@/components/Search'
import { getAllBooks } from '@/lib/actions/book.actions';

export const dynamic = 'force-dynamic';

const Page = async ({ searchParams }: PageProps<"/">) => {
  const { query } = await searchParams;
  const search = typeof query === 'string' ? query.trim() : '';

  // Empty search returns every book; otherwise a case-insensitive match on title or author
  const booksResults = await getAllBooks(search || undefined);
  const books = booksResults.success ? booksResults.data ?? [] : [];

  return (
    <main className="wrapper container">
      <HeroSection />

      <div className="library-filter-bar">
        <h2 className="section-title">Recent Books</h2>
        <Search />
      </div>

      {books.length > 0 ? (
        <div className="library-books-grid">
          {books.map((book) => (
            <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} />
          ))}
        </div>
      ) : (
        <div className="library-empty-card text-center">
          <p className="library-step-title">
            {search ? `No books match "${search}"` : 'No books yet'}
          </p>
          <p className="library-step-description mt-1">
            {search ? 'Try a different title or author.' : 'Add your first book to get started.'}
          </p>
        </div>
      )}
    </main>
  )
}

export default Page
