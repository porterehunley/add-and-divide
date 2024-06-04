import '@/app/globals.css';

export default function Skeleton({ style }: {style: React.CSSProperties}) {
  return (
    <div className="space-y-4 rounded-lg bg-[#f0f0f5] animate-pulse" style={style} />
  );
}