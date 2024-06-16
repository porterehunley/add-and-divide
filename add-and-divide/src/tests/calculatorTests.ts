const { minimizeTransactions } = require("./calculator");
const  { member } = require("./dbopps");

const testCases = [
  {
    members: [
      { id: '1', name: 'Alice', expenses: [{ amount: 100 }, { amount: 50 }] },
      { id: '2', name: 'Bob', expenses: [{ amount: 200 }] },
      { id: '3', name: 'Charlie', expenses: [{ amount: 150 }] },
    ],
    expected: [
      { from: '1', to: '2', amount: 50 },
    ],
  },
  {
    members: [
      { id: '1', name: 'Alice', expenses: [{ amount: 300 }] },
      { id: '2', name: 'Bob', expenses: [{ amount: 100 }] },
      { id: '3', name: 'Charlie', expenses: [{ amount: 100 }] },
      { id: '4', name: 'David', expenses: [{ amount: 100 }] },
    ],
    expected: [
      { from: '2', to: '1', amount: 50 },
      { from: '3', to: '1', amount: 50 },
      { from: '4', to: '1', amount: 50 },
    ],
  },
  {
    members: [
      { id: '1', name: 'Alice', expenses: [{ amount: 100 }] },
      { id: '2', name: 'Bob', expenses: [{ amount: 200 }] },
      { id: '3', name: 'Charlie', expenses: [{ amount: 300 }] },
    ],
    expected: [
      { from: '1', to: '3', amount: 100 },
      { from: '2', to: '3', amount: 100 },
    ],
  },
];

testCases.forEach(({ members, expected }, index) => {
  const result = minimizeTransactions(members);
  console.log(`Test Case ${index + 1}:`, JSON.stringify(result) === JSON.stringify(expected) ? 'Passed' : 'Failed');
});
