import {useEffect, useState} from "react";

import MobilePools from "@/src/components/pages/liquidity-page/components/Pools/MobilePools/MobilePools";
import DesktopPools from "@/src/components/pages/liquidity-page/components/Pools/DesktopPools/DesktopPools";
import Pagination from "@/src/components/common/Pagination/Pagination";
import {SearchBar} from "@/src/components/common/SearchBar/SearchBar";
import usePoolsData, {DEFAULT_PAGE} from "@/src/hooks/usePoolsData";
import useDebounce from "@/src/hooks/useDebounce";

import clsx from "clsx";
import styles from "./Pools.module.css";
import LoadingIndicator from "@/src/components/common/LoadingIndicator/LoadingIndicator";

const Pools = () => {
  const {data, isLoading, moreInfo} = usePoolsData();

  const {
    totalCount,
    totalPages,
    queryVariables: {search, page, orderBy},
    setQueryVariables,
  } = moreInfo;

  const [searchInput, setSearchInput] = useState(search || "");
  const debouncedSearchTerm = useDebounce(searchInput, 300);

  // Initialize query variables on component mount
  useEffect(() => {
    setQueryVariables({page: page || DEFAULT_PAGE});
  }, [page, setQueryVariables]);

  // Update search query when debounced value changes
  useEffect(() => {
    if (search !== debouncedSearchTerm) {
      setQueryVariables({search: debouncedSearchTerm, page: DEFAULT_PAGE});
    }
  }, [debouncedSearchTerm, setQueryVariables, search]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle sorting by toggling ASC/DESC
  const handleSort = (key: string) => {
    setQueryVariables(() => {
      const [prevKey, prevDirection] = orderBy.split("_");
      const newDirection =
        prevKey === key && prevDirection === "ASC" ? "DESC" : "ASC";
      return {orderBy: `${key}_${newDirection}`};
    });
  };

  // Render pagination
  const handlePageChange = (page: number) => setQueryVariables({page: page});

  return (
    <section className={styles.pools}>
      {/* Header with Search Bar */}
      <div className={styles.poolsHeader}>
        <p className={clsx(styles.poolsTitle, "mc-type-xxxl")}>All Pools</p>
        <SearchBar
          placeholder="Symbol or address..."
          className={styles.poolsSearchBar}
          value={searchInput}
          onChange={handleSearchChange}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className={styles.loadingFallback}>
          <LoadingIndicator fontSize="mc-mono-xxxxl" />
          <p>Loading pools...</p>
        </div>
      )}

      {/* Pools List (Mobile and Desktop) */}
      <MobilePools poolsData={data} orderBy={orderBy} handleSort={handleSort} />
      <DesktopPools
        poolsData={data}
        orderBy={orderBy}
        handleSort={handleSort}
      />

      {/* Pagination */}
      {data && data.length > 0 && (
        <div className={styles.pagination}>
          <p className={clsx("desktopOnly", "mc-type-b")}></p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </section>
  );
};

export default Pools;
