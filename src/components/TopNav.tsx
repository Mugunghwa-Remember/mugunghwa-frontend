import { useLocation, useNavigate } from "react-router-dom";
import { safeTrack } from "../utils/mixpanel";

export default function TopNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items: Array<{ key: string; label: string; to: string }> = [
    { key: "intro", label: "처음으로", to: "/" },
    { key: "plant", label: "심기", to: "/plant" },
    { key: "explore", label: "구경하기", to: "/explore" },
    { key: "result", label: "결과", to: "/result" },
  ];

  function isActive(to: string) {
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  }

  const handleNavigation = (item: {
    key: string;
    label: string;
    to: string;
  }) => {
    safeTrack("top_nav_click", {
      from_page: pathname,
      to_page: item.to,
      nav_item: item.key,
      nav_label: item.label,
    });

    navigate(item.to);
  };

  return (
    <nav className="md:sticky md:top-3 fixed top-0 w-full left-0 z-[2001] mb-3 hidden">
      <div className="mx-auto max-w-md bg-white/80 backdrop-blur border border-black/10 md:rounded-full h-12 box-border shadow-soft flex overflow-hidden">
        {items.map((it) => {
          const active = isActive(it.to);
          return (
            <button
              key={it.key}
              onClick={() => handleNavigation(it)}
              aria-current={active ? "page" : "false"}
              className={`flex-1 py-2 text-sm font-semibold ${
                active ? "bg-black/80 text-white" : "bg-white"
              }`}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
