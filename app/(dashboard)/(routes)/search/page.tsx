export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { SearchPageContent } from "./_components/search-content";

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Завантаження...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}