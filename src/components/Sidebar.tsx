export default function Sidebar() {
  return (
    <div className="h-screen w-20 bg-[#302d2a] text-white flex flex-col p-4 space-y-4">
      <nav className="flex flex-col space-y-4">
        {/* ------------------------- MENU ------------------------- */}
        <a
          href="/menu"
          className="flex flex-col items-center gap-2 px-4 py-2 rounded mt-2 mb-6"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M4 18L20 18"
                stroke="#FFFF"
                stroke-width="2"
                stroke-linecap="round"
              ></path>{" "}
              <path
                d="M4 12L20 12"
                stroke="#FFFF"
                stroke-width="2"
                stroke-linecap="round"
              ></path>{" "}
              <path
                d="M4 6L20 6"
                stroke="#FFFF"
                stroke-width="2"
                stroke-linecap="round"
              ></path>{" "}
            </g>
          </svg>
        </a>

        {/* ------------------------- HOME ------------------------- */}
        <a
          href="/"
          className="flex flex-col items-center gap-2 px-4 py-2 rounded "
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path
              d="M22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274"
              stroke="#c74634"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[#c74634]">Home</span>
        </a>

        {/* ------------------------- Calendar ------------------------- */}
        <a
          href="/calendar"
          className="flex flex-col items-center gap-2 px-4 py-2 rounded "
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path
              d="M3 9H21M7 3V5M17 3V5M7 13H17V17H7V13ZM6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"
              stroke="#c74634"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[#c74634]">Calendar</span>
        </a>

        {/* ------------------------- ChatBot ------------------------- */}
        <a
          href="/chatbot"
          className="flex flex-col items-center gap-2 px-4 py-2 rounded "
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path
              d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7"
              stroke="#c74634"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[#c74634]">ChatBot</span>
        </a>
      </nav>
    </div>
  );
}
