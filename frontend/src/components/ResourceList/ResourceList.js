import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import { Context } from "../../Context";
import SearchForm from "../SearchForm/SearchForm";
import { bookmarkIcon, removeBookmarkIcon } from "../../svgs";
import ResourceSkeleton from "../ResourceSkeleton/ResourceSkeleton";

function ResourceList() {
  const {
    addBookmark,
    bookmarks,
    removeBookmark,
    searchTerm,
    resources,
    setPageTitle,
    loadMoreResources,
    renderedResources,
    setRenderedResources,
    isLoading,
    setPageParams
  } = useContext(Context);

  const {filterType} = useParams();

  const handlePageTitleUpdate = () => (
    (filterType && filterType.length)
    ? setPageTitle(`Resources - ${filterType} | Coding Resource Finder`)
    : setPageTitle(`Resources | Coding Resource Finder`)
  );
  
  useEffect(() => {
    handlePageTitleUpdate()
     // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setPageParams(filterType);
    // eslint-disable-next-line
  },[filterType]);

  return (
    <div className="resource-list">
      <SearchForm />
      {renderedResources.length !== 0 ? (
        renderedResources.map((resource) => {
          const isBookmarked = bookmarks.find((bookmark) => {
            return bookmark.url === resource.url;
          });
          const icon = isBookmarked ? (
            <button
              className={"remove-bookmark-button"}
              onClick={() => {
                removeBookmark(resource.url);
              }}
              title="remove bookmark"
            >
              {removeBookmarkIcon}
            </button>
          ) : (
            <button
              className={"bookmark-button"}
              onClick={() => {
                addBookmark(resource.url);
              }}
              title="add bookmark"
            >
              {bookmarkIcon}
            </button>
          );

          return (
            <div className="resource-wrapper" key={nanoid()}>
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="resource"
              >
                <h3 className="resource-title">{resource.title}</h3>
                <span className="resource-type">{resource.type}</span>
              </a>
              {icon}
            </div>
          );
        })
      ) : searchTerm ? (
        <h2 className="content-placeholder">Resource(s) not found...</h2>
      ) : (
        [...Array(20)].map((_, index) => (
          <ResourceSkeleton key={`skeleton${index}`} />
        ))
      )}
      <button
        className="load-more-btn"
        onClick={loadMoreResources}
        disabled={
          renderedResources.length === resources.length || searchTerm.trim()
        }
      >
        {isLoading ? "Loading..." : "Load 20 more resources"}
      </button>
      <button
        className="load-more-btn"
        onClick={() => setRenderedResources(resources)}
        disabled={
          renderedResources.length === resources.length || searchTerm.trim()
        }
      >
        {`Load all resources (${resources.length - renderedResources.length})`}
      </button>
    </div>
  );
}

export default ResourceList;
