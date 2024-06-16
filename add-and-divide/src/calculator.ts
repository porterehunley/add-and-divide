import { member } from "./dbopps";


type Transaction = {
  from: string;
  to: string;
  amount: number;
};

export function calculateNetBalances(members: member[]): { [key: string]: number } {
  const balances: { [key: string]: number } = {};

  members.forEach(member => {
    const totalExpenses = member.expenses?.reduce((sum, expense) => sum + expense.amount, 0);
    balances[member.name] = totalExpenses ?? 0;
  });

  const totalExpenses = Object.values(balances).reduce((sum, balance) => sum + balance, 0);
  const averageExpense = totalExpenses / members.length;

  for (const memberId in balances) {
    balances[memberId] -= averageExpense;
  }

  return balances;
}

export function minimizeTransactions(members: member[]): Transaction[] {
  const balances = calculateNetBalances(members);
  const creditors: { id: string; balance: number }[] = [];
  const debtors: { id: string; balance: number }[] = [];

  for (const [id, balance] of Object.entries(balances)) {
    if (balance > 0) {
      creditors.push({ id, balance });
    } else if (balance < 0) {
      debtors.push({ id, balance });
    }
  }

  creditors.sort((a, b) => b.balance - a.balance);
  debtors.sort((a, b) => a.balance - b.balance);

  const transactions: Transaction[] = [];

  while (creditors.length && debtors.length) {
    const creditor = creditors[0];
    const debtor = debtors[0];

    const amount = Math.min(creditor.balance, -debtor.balance);

    transactions.push({
      from: debtor.id,
      to: creditor.id,
      amount,
    });

    creditor.balance -= amount;
    debtor.balance += amount;

    if (creditor.balance === 0) {
      creditors.shift();
    }

    if (debtor.balance === 0) {
      debtors.shift();
    }
  }

  return transactions;
}
