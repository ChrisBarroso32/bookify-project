'use client';

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

// Keeps the query in the URL (?query=...) so results are shareable and rendered on the server
const Search = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('query') ?? '');

    const handleChange = (value: string) => {
        setQuery(value);

        const params = new URLSearchParams(searchParams.toString());
        const trimmed = value.trim();

        if (trimmed) params.set('query', trimmed);
        else params.delete('query');

        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    };

    return (
        <div className="library-search-wrapper">
            <SearchIcon className="ml-3 size-5 text-[var(--text-secondary)] shrink-0" />
            <input
                type="search"
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Search by title or author"
                aria-label="Search books by title or author"
                className="library-search-input"
            />
        </div>
    )
}

export default Search
