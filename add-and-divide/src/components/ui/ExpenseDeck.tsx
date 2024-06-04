import { member } from "@/dbopps";
import ExpenseSection, { ExpenseSecionProps } from "./expenseSection";
import Skeleton from '@/components/ui/Skeleton'

interface ExpenseDeckProps {
  members?: member[];
  splitTotal: number;
}

export default function ExpenseDeck({
  members, splitTotal }: ExpenseDeckProps
) {

  if (members === undefined) {
    return (
      [...new Array(3)].map(x => (
        <div key={x} className="flex-col mb-4">
          <div className="w-full flex gap-5 mb-2">
            <Skeleton style={{width: 80, height: 30}}/>
            <Skeleton style={{width: 80, height: 30}}/>
          </div>
          {[...new Array(3)].map(y => (
            <div key={x+y} className="w-full flex justify-between mb-1">
              <Skeleton style={{width: 120, height: 20}}/>
              <Skeleton style={{width: 40, height: 20}}/>
            </div>
          ))}
        </div>
      ))
    );
  }

  return (
    <>
    {members.map((member, idx) => (
      <ExpenseSection
        key={member.name}
        style={
          idx+1 === members.length ? {'border': 'none'} : {}
        }
        member={member}
        splitTotal={splitTotal}/>
    ))}
    </>
  );
}