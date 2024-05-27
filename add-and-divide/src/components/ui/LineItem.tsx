export interface LineItemProps {
  name: string;
  amount: number;
}

export function LineItem({ name, amount }: LineItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#6b5b95]">{name}</span>
      <span className="font-bold text-[#9370db] text-sm">${amount}</span>
    </div>
  );
}
