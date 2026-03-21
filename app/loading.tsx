export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-700 border-t-transparent" />
        <p className="text-sm text-zinc-600">Loading…</p>
      </div>
    </div>
  );
}
