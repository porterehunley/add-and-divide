import { Transaction } from "@/dbopps";
import ChordGraph from "./ChordGraph";

function transactions2Flows(transactions: Transaction[]): number[][] {
  const members = Array.from(new Set(transactions.flatMap(t => [t.from, t.to])));
  const memberIndex = new Map(members.map((member, index) => [member, index]));
  const matrix = Array(members.length).fill(0).map(() => Array(members.length).fill(0));

  transactions.forEach(transaction => {
    const fromIndex = memberIndex.get(transaction.from);
    const toIndex = memberIndex.get(transaction.to);
    if (fromIndex !== undefined && toIndex !== undefined) {
      matrix[fromIndex][toIndex] += transaction.amount;
    }
  });

  return matrix;
}

export default function TransactionsView({ transactions }: { transactions: Transaction[] }) {
  return (
    <ChordGraph 
      flow={transactions2Flows(transactions)}
      colors={[ "#440154ff", "#31668dff", "#37b578ff", "#fde725ff"]} />
  );
}
