export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-400"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-yellow-400/20"></div>
          </div>
        </div>
        <p className="text-sm font-medium text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );
}
