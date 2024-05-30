import { useState, useEffect } from 'react';
import { LineItem } from '@/components/ui/LineItem';
import { member } from '@/dbopps';

const getMemeberTotal = (member: member) => {
  return member.expenses?.reduce((total, exp) => total + exp.ammount, 0) ?? 0;
}

export function ExpenseSection(
  { member, splitTotal, style }: { member: member, splitTotal: number, style?: React.CSSProperties }
) {

  return (
    <div className="border-b border-[#e6e6e6] dark:border-[#3c3c58] pb-4" style={style}>
      <h2 className="font-medium text-[#6b5b95]">
        {member.name} <span className="text-[#9370db] font-bold">{
          `${getMemeberTotal(member) - splitTotal > 0 ? '+' : '-'}$${Math.abs(getMemeberTotal(member) - splitTotal)}`
        }</span>
      </h2>

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
