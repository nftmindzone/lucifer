export default function SkeletonCard({ count = 6 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="animate-pulse">
      <div className="aspect-[2/3] rounded-xl bg-gray-800" />
      <div className="mt-2 space-y-1.5 px-0.5">
        <div className="h-3.5 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800/60 rounded w-1/3" />
      </div>
    </div>
  ));
}
