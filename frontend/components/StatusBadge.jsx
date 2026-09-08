export default function StatusBadge({ status }) {
  let className = "px-3 py-1 rounded-full text-sm";

  if (status === "Completed") {
    className += " bg-green-100 text-green-700";
  } else if (status === "In Progress") {
    className += " bg-yellow-100 text-yellow-700";
  } else {
    className += " bg-gray-100 text-gray-700";
  }

  return (
    <span className={className}>
      {status}
    </span>
  );
}