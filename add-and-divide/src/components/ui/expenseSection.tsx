import { useState, useEffect } from 'react';
import { LineItem } from '@/components/ui/LineItem';
import { member } from '@/dbopps';
import Badge from './Badge';

const getMemeberTotal = (member: member) => {
  return member.expenses?.reduce((total, exp) => total + exp.ammount, 0) ?? 0;
}

export interface ExpenseSecionProps {
  member: member;
  splitTotal: number;
  isComplete: boolean;
  style?: React.CSSProperties;
}

export default function ExpenseSection(
  { member, splitTotal, style, isComplete }: ExpenseSecionProps
) {

  return (
    <div className="border-b border-[#e6e6e6] dark:border-[#3c3c58] pb-4" style={style}>
      <div className="flex flex-row justify-between">
        <h2 className="font-medium text-[#6b5b95]">
          {member.name} <span className="text-[#9370db] font-bold">{
            `${getMemeberTotal(member) - splitTotal > 0 ? '+' : '-'}$${Math.abs(getMemeberTotal(member) - splitTotal)}`
          }</span>
        </h2>
        {isComplete && <Badge>{'Completed'}</Badge>}
      </div>

      <div className='flex flex-col'>
        {member.expenses?.map(expense => (
          <LineItem 
            key={expense.title}
            name={expense.title}
            amount={expense.ammount}/>
        ))}
      </div>
    </div>
  );
}
