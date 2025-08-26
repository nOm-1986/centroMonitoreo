// src/components/ui/SkeletonLoader.jsx

export default function SkeletonLoader({ cardCount = 6 }) {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-neutral-700 rounded-sm w-1/2 mx-auto" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: cardCount }).map((_, i) => (
          <div key={i} className="bg-[#262626] p-5 rounded-lg border border-[#666666] shadow-sm">
            <div className="h-6 bg-neutral-700 rounded-sm mb-4" />
            <div className="h-8 bg-neutral-600 rounded-sm mb-2" />
            <div className="h-3 bg-neutral-700 rounded-sm w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}