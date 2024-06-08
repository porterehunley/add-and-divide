export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-1 text-sm text-[#6b5b95] rounded-md bg-[#f0f0f5]">
      {children}
    </div>
  );
}