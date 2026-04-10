export default function Loading() {
  return (
    <main className="mx-auto max-w-[1200px] px-6 py-24 md:px-8 md:py-32">
      <div className="max-w-3xl space-y-6 animate-pulse">
        <div className="h-3 w-32 rounded bg-white/10" />
        <div className="h-12 w-full max-w-2xl rounded bg-white/10 md:h-16" />
        <div className="h-6 w-full max-w-3xl rounded bg-white/5" />
        <div className="h-6 w-5/6 rounded bg-white/5" />
      </div>
    </main>
  )
}