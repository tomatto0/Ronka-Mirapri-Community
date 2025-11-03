import { useRouter } from "next/navigation";
import "../css/SearchResult.css";
import { useRef, useState, useEffect } from "react";

export default function UserSearchResult({
  search_result,
}: {
  search_result: string[];
}) {
  const router = useRouter();
  const SearchedUser = ({
    user_name,
    click_handler,
  }: {
    user_name: string;
    click_handler: (user_name: string) => void;
  }) => {
    const component = useRef<HTMLDivElement | null>(null);
    const click_handler_container = () => {
      click_handler(user_name);
    };

    return (
      <div
        className="search-result-user"
        ref={component}
        onClick={click_handler_container}
      >
        <span>{user_name}</span>
      </div>
    );
  };

  const loader = useRef<HTMLDivElement | null>(null);
  const [is_loading, set_is_loading] = useState<boolean>(false);
  const [page, set_page] = useState<number>(1);
  const [show_result, set_show_result] = useState<string[]>(
    search_result.slice(0, 10)
  );
  const click_handler = (user_name: string) => {
    // console.log(user_name);
    router.push(`/user/${user_name}`);
  };

  useEffect(() => {
    if (search_result.length === show_result.length) {
      return;
    }
    const observer = new IntersectionObserver(
      e => {
        if (e[0].isIntersecting && !is_loading) {
          set_is_loading(true);
          set_show_result(search_result.slice(0, (page + 1) * 10));
          set_page(page + 1);
          set_is_loading(false);
        }
      },
      { threshold: 0 }
    );

    const loader_current = loader.current;
    if (loader_current) {
      observer.observe(loader_current);
    }

    return () => {
      if (loader_current) {
        observer.unobserve(loader_current);
      }
    };
  }, [is_loading, page, search_result, show_result]);

  useEffect(() => {
    set_show_result(search_result.slice(0, 10));
  }, [search_result]);

  return (
    <div className="search-result-container-user">
      <div>
        {show_result.map(user_name => (
          <SearchedUser
            user_name={user_name}
            click_handler={click_handler}
            key={user_name}
          />
        ))}
      </div>
      <div ref={loader} className="loader">
        {is_loading && <span></span>}
      </div>
    </div>
  );
}
