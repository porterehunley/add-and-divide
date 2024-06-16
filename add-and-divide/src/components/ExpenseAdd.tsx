// Loading
// Adding
// disabling
import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { expense } from "@/dbopps";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { addExpenseToMember } from '@/dbopps';

interface ExpenseAddProps {
  groupId: string,
  memberId?: string,
  onExpenseAdd?: (expense: expense) => Promise<void>
}

export default function ExpenseAdd({ 
    memberId, groupId, onExpenseAdd 
  }: ExpenseAddProps) {
  const [expenseAmmount, setExpenseAmmount] = useState<number>();
  const [rawCurrInput, setRawCurrInput] = useState<string>();
  const [expenseName, setExpenseName] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>();

  const validateValue = (value: string | undefined): void => {
    setRawCurrInput(value);
    const rawValue = value === undefined ? 'undefined' : value;
    if (Number.isNaN(rawValue)) {
      return;
    }
    setExpenseAmmount(Number(rawValue));
  }

  const addExpenseClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!expenseName || !expenseAmmount || !memberId) {
      console.log("data not set");
      return
    }

    setIsLoading(true);
    const expense = await addExpenseToMember(
      groupId,
      memberId,
      expenseAmmount,
      expenseName);

    if (onExpenseAdd) {
      onExpenseAdd(expense);
    }
    setIsLoading(false);
    setRawCurrInput('');
    setExpenseName('');
  }

  return (
    <div className="flex items-center gap-2 flex-col">
      <Input
        className="flex-1 border-[#e6e6e6] dark:border-[#3c3c58] 
          bg-[#f0f0f5] dark:bg-[#2c2c54] text-[#6b5b95]"
        placeholder="Expense Name"
        value={expenseName}
        onChange={(e) => setExpenseName(e.target.value)}
        type="text"
      />
      <div className='w-full justify-between flex'>
        <CurrencyInput 
          placeholder="$42"
          allowDecimals={false}
          onValueChange={(value) => validateValue(value)}
          value={rawCurrInput}
          className='border border-[#e6e6e6] dark:border-[#3c3c58] 
          bg-[#f0f0f5] dark:bg-[#2c2c54] text-[#6b5b95] px-3 py-2
          rounded-md h-10 focus-visible:ring-2 focus-visible:ring-gray-950
          ring-offset-white focus-visible:outline-none text-sm
          focus-visible:ring-offset-2 placeholder:text-gray-400'
          prefix={'$'}
          step={10}
        />
        <Button
          disabled={!expenseName?.trim() || !memberId || !expenseAmmount}
          onClick={(e) => addExpenseClick(e)}
          isLoading={isLoading}
          className="bg-[#9370db] hover:bg-[#8258fa] text-white">Add</Button>
      </div>
    </div>
  );
}