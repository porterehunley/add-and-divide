import { useState } from "react";
import { Input } from "@/components/ui/input";
import { formatCurrency, parseCurrency } from "@/currency";

interface CurrencyInputProps {
  setValue: (val: number) => void;
}

export function CurrencyInput({ setValue }: CurrencyInputProps) {
  const [currentVal, setCurrentVal] = useState<number>();

  return (
    <Input
      className="w-200 border-[#e6e6e6] dark:border-[#3c3c58] 
        bg-[#f0f0f5] dark:bg-[#2c2c54] text-[#6b5b95]"
      placeholder="Ammount"
      type="text"
      value={currentVal ? formatCurrency(currentVal) : ''}
      onBlur={() => setValue(currentVal ?? 0)}
      onChange={(e) => setCurrentVal(parseCurrency(e.target.value))}
    />
  );
}