interface TaskNotification {
  title: string;
  description: string;
}
export default function Notification({ title, description }: TaskNotification) {
  return (
    <div className="flex items-start gap-3 bg-neutral-100 p-4 rounded-2xl shadow-sm max-w-sm border border-gray-200">
      <div>
        <h2 className="text-md font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
