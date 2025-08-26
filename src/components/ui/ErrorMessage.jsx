// src/components/ui/ErrorMessage.jsx
export default function ErrorMessage({ error, onRetry }) {
  return (
    <div className="text-red-400 p-6 flex flex-col items-center">
      <div>Error: {error}</div>
      <button 
        onClick={onRetry || (() => window.location.reload())}
        className="mt-2 bg-red-500 text-white px-4 py-2 rounded-sm"
      >
        Reintentar
      </button>
    </div>
  );
}