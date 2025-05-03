interface Props {
  total: number;
  perPage: number;
  page: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ total, perPage, page, onPageChange }: Props) {
  const pages = Math.ceil(total / perPage);

  if (pages <= 1) return null;

  return (
    <div className="flex gap-2 mt-4">
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i}
          className={`px-3 py-1 rounded ${
            page === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}