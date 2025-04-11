interface taskNotification {
  title: string;
  description: string;
}
export default function Notification({ title, description }: taskNotification) {
  return (
    <div className="bg-white">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
