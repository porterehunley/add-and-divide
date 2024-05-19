import React from 'react';
import {LineItem, LineItemProps} from '@/components/ui/LineItem';

export function ExpenseSection(
  { name, owed, children }: 
  { name: string; 
    owed: number, 
    children?: React.ReactElement<LineItemProps>[] 
  }) {
  return (
    <div className="border-b border-[#e6e6e6] dark:border-[#3c3c58] pb-4">
      <h2 className="font-medium text-[#6b5b95]">
        {name} <span className="text-[#9370db] font-bold">{
          `${owed > 0 ? '+' : '-'} ${Math.abs(owed)}`
        }</span>
      </h2>
      {children}
    </div>
  );
}
