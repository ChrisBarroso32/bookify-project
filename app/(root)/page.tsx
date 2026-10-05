import HeroSection from '@/components/HeroSection'
import BookCard from '@/components/BookCard'
import { getAllBooks } from '@/lib/actions/book.actions';

const Page = async () => {
  const booksResults = await getAllBooks();
  const books = booksResults.success ? booksResults.data ?? [] : [];
  return (
    <main className="wrapper container">
      <HeroSection />

      <div className="library-books-grid">
        {books.map((book) => (
          <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} />
        ))}
      </div>
    </main>
  )
}

export default Page
