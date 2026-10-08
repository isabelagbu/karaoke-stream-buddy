import { usePlayerStore } from '../store/usePlayerStore'

export function Player() {
  const nowPlaying = usePlayerStore((s) => s.nowPlaying)

  if (!nowPlaying) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-neutral-900 text-neutral-500">
        Pick a song to start playing
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          key={nowPlaying.id}
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${nowPlaying.youtubeId}?autoplay=1`}
          title={nowPlaying.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="mt-2 text-sm text-neutral-400">
        Now playing: <span className="text-neutral-100">{nowPlaying.title}</span>
        {nowPlaying.artist && <span> — {nowPlaying.artist}</span>}
      </p>
    </div>
  )
}
