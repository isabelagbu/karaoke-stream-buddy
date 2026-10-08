import { useEffect, useMemo, useRef, useState } from 'react'
import { useSongsStore } from '../store/useSongsStore'
import { useFiltersStore, songMatchesFilters } from '../store/useFiltersStore'
import { usePlayerStore } from '../store/usePlayerStore'
import { CategoryFilters } from './CategoryFilters'
import type { Song } from '../types'

const COLORS = [
  '#6366f1',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#ef4444',
  '#8b5cf6',
  '#14b8a6',
]
const SIZE = 320

export function Wheel() {
  const songs = useSongsStore((s) => s.songs)
  const filters = useFiltersStore()
  const play = usePlayerStore((s) => s.play)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<Song | null>(null)

  const pool = useMemo(() => songs.filter((song) => songMatchesFilters(song, filters)), [songs, filters])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const radius = SIZE / 2

    ctx.clearRect(0, 0, SIZE, SIZE)

    if (pool.length === 0) {
      ctx.beginPath()
      ctx.arc(radius, radius, radius - 2, 0, Math.PI * 2)
      ctx.fillStyle = '#262626'
      ctx.fill()
      return
    }

    const segmentAngle = (Math.PI * 2) / pool.length
    pool.forEach((_, i) => {
      const start = i * segmentAngle
      const end = start + segmentAngle
      ctx.beginPath()
      ctx.moveTo(radius, radius)
      ctx.arc(radius, radius, radius - 2, start, end)
      ctx.closePath()
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fill()
    })
  }, [pool])

  function handleSpin() {
    if (pool.length === 0 || spinning) return
    const segmentAngleDeg = 360 / pool.length
    const winningIndex = Math.floor(Math.random() * pool.length)
    const segmentCenter = winningIndex * segmentAngleDeg + segmentAngleDeg / 2
    const base = ((-90 - segmentCenter) % 360 + 360) % 360
    const extraSpins = 5 + Math.floor(Math.random() * 3)
    const newRotation = rotation - (rotation % 360) + extraSpins * 360 + base

    setSpinning(true)
    setWinner(null)
    setRotation(newRotation)

    const transitionMs = 3200
    window.setTimeout(() => {
      setSpinning(false)
      setWinner(pool[winningIndex])
    }, transitionMs)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col items-center gap-6">
        {pool.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No songs match your current filters. Clear a filter or add songs to spin the wheel.
          </p>
        ) : (
          <>
            <div className="relative" style={{ width: SIZE, height: SIZE }}>
              <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 border-x-8 border-t-[16px] border-x-transparent border-t-neutral-100" />
              <canvas
                ref={canvasRef}
                width={SIZE}
                height={SIZE}
                className="rounded-full"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 3.2s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
                }}
              />
            </div>

            <button
              onClick={handleSpin}
              disabled={spinning}
              className="rounded-md bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {spinning ? 'Spinning…' : 'Spin the wheel'}
            </button>

            {winner && !spinning && (
              <div className="w-full max-w-sm rounded-lg bg-neutral-900 p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-neutral-500">Your next song</p>
                <p className="mt-1 text-lg font-semibold text-neutral-100">{winner.title}</p>
                {winner.artist && <p className="text-sm text-neutral-400">{winner.artist}</p>}
                <button
                  onClick={() => play(winner)}
                  className="mt-3 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  Play it
                </button>
              </div>
            )}

            <ul className="flex w-full max-w-sm flex-wrap gap-2 text-xs text-neutral-400">
              {pool.map((song, i) => (
                <li key={song.id} className="flex items-center gap-1">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  {song.title}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <CategoryFilters />
    </div>
  )
}
