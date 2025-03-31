export default function Ticket() {
  return (
    <div className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-transparent p-6 shadow-lg ">
      <img
        className="size-12 shrink-0 shadow-sm"
        src="/img/logo.svg"
        alt="ChitChat Logo"
      />
      <div>
        <div className="text-xl font-medium text-black">Ticket</div>
        <p className="text-gray-500">Description</p>
      </div>
    </div>
  );
}
