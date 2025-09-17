import { Suspense } from "react";

import { CompanySearchBar } from "../_components/company-search-bar";
import {
  CompanySearchResults,
  CompanySearchResultsSpinner,
} from "../_components/company-search-results";
import { AddCompanyButton } from "../_components/add-company-button";

export async function CompanySearchSection(props: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const params = await props.searchParams;
  const query = params?.q ?? "";

  return (
    <div className="w-full pt-2">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <CompanySearchBar />
        </div>

        {query && (
          <div className="mt-4 rounded-xl border">
            <Suspense fallback={<CompanySearchResultsSpinner />}>
              <CompanySearchResults query={query} />
            </Suspense>
            <div className="flex items-center justify-end gap-3 border-t px-4 py-3">
              <AddCompanyButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
