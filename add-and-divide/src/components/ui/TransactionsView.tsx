import { Transaction } from "@/dbopps";

export default function TransactionsView({ transactions }: { transactions: Transaction[] }) {
  return (
    <>
    {transactions?.map((transaction, idx) =>
      <div key={`${transaction.from}-${idx}`}>
        <p>{`from ${transaction.from}`}</p>
        <p>{`to ${transaction.to}`}</p>
        <p>{`amount ${transaction.amount}`}</p>
      </div>
    )}
    </>
  );
}
