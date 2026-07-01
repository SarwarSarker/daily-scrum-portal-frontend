const AVATAR_COLORS = [
  'bg-indigo-500 text-white',
  'bg-emerald-500 text-white',
  'bg-rose-500 text-white',
  'bg-amber-500 text-white',
  'bg-sky-500 text-white',
  'bg-violet-500 text-white',
  'bg-teal-500 text-white',
  'bg-orange-500 text-white',
  'bg-fuchsia-500 text-white',
  'bg-cyan-500 text-white',
]

/** Pick a stable, colorful `bg`/`text` class for an avatar based on a key (id or name). */
export function avatarColor(key: string): string {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
