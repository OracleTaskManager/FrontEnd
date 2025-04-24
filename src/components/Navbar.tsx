// Attributes to help the component show thw page title
export default function Navbar({ pageTitle }: { pageTitle: string }) {
  return (
    <div className="h-20 w-screen bg-[#302d2a] text-white flex items-center p-4">
      <nav className="flex flex-row items-center space-x-4 w-full">
        {/* ------------------------- ORACLE LOGO ------------------------- */}
        <a href="/dashboard" className="flex items-center px-1 py-2 rounded">
          <svg viewBox="0 0.3 31.4 19.8" className="w-10 h-10">
            <path
              d="M9.9 20.1c-5.5 0-9.9-4.4-9.9-9.9S4.4.3 9.9.3h11.6c5.5 0 9.9 4.4 9.9 9.9s-4.4 9.9-9.9 9.9zm11.3-3.5c3.6 0 6.4-2.9 6.4-6.4 0-3.6-2.9-6.4-6.4-6.4h-11c-3.6 0-6.4 2.9-6.4 6.4s2.9 6.4 6.4 6.4z"
              fill="#c74634"
            />
          </svg>
        </a>

        {/* ------------------------- RETURN BUTTON ------------------------- */}
        {/* If we are currently in HOME, we don't need the return button */}
        {pageTitle !== "Home" && (
          <a href="/dashboard" className="flex items-center">
            <div className="w-10 h-10 bg-[#c74634] rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </a>
        )}

        {/* ------------------------- PAGE TITLE ------------------------- */}
        <span className="text-lg font-semibold">{pageTitle}</span>
      </nav>
    </div>
  );
}
