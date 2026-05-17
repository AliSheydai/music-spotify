"use client";

/**
 * AnimatedBars — Spotify-style equalizer icon.
 * Shows animated bars when `isPlaying` is true,
 * and a static low-bar state when paused (but active).
 */
export default function AnimatedBars({ isPlaying }: { isPlaying: boolean }) {
  return (
    <span className="flex items-end gap-[2px] h-4 w-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-sm bg-accent-gold origin-bottom"
          style={{
            height: isPlaying ? undefined : "30%",
            animation: isPlaying
              ? `equalizerBar ${0.9 + i * 0.15}s ease-in-out infinite alternate`
              : "none",
            animationDelay: isPlaying ? `${i * 0.12}s` : "0s",
          }}
        />
      ))}

      <style>{`
        @keyframes equalizerBar {
          0%   { height: 20%; }
          25%  { height: 80%; }
          50%  { height: 45%; }
          75%  { height: 95%; }
          100% { height: 30%; }
        }
      `}</style>
    </span>
  );
}
