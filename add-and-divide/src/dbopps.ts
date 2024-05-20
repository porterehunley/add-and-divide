import { app } from '@/firebase';
import { 
  addDoc, 
  collection, 
  getFirestore,
  doc,
  updateDoc,
  getDoc,
  arrayUnion } from 'firebase/firestore';

export interface group {
  id: string,
  name: string,
  memebers?: member[]
}

export interface member {
  id: string,
  name: string,
  expenses?: expense[]
}

export interface expense {
  id: string,
  ammount: number,
  title: string
}

const db = getFirestore(app);

export async function getGroupWithChildren(groupId: string) {
  try {
    const groupRef = doc(db, "groups", groupId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      throw new Error("Group not found");
    }

    const groupData = groupSnap.data();
    const members = groupData.members || [];

    // Fetch all members and their expenses
    const membersWithExpenses = await Promise.all(
      members.map(async (member: member) => {
        const memberRef = doc(db, "members", member.id);
        const memberSnap = await getDoc(memberRef);

        if (!memberSnap.exists()) {
          throw new Error(`Member with ID ${member.id} not found`);
        }

        const memberData = memberSnap.data();
        const expenses = memberData.expenses || [];

        return {
          ...memberData,
          expenses: await Promise.all(
            expenses.map(async (expense: expense) => {
              const expenseRef = doc(db, "expenses", expense.id);
              const expenseSnap = await getDoc(expenseRef);

              if (!expenseSnap.exists()) {
                throw new Error(`Expense with ID ${expense.id} not found`);
              }

              return expenseSnap.data();
            })
          )
        };
      })
    );

    return {
      ...groupData,
      members: membersWithExpenses
    };
  } catch (e) {
    console.error("Error fetching group with children: ", e);
    throw e;
  }
}

export async function createGroup(groupName: string) {
  try {
    const docRef = await addDoc(collection(db, "groups"), {
      name: groupName,
    });
    console.log("Group created with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding group: ", e);
    throw e;
  }
}

export async function addMemberToGroup(groupId: string, member: member) {
  try {
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      members: arrayUnion(member)
    });
    console.log(`Member ${member.name} added to group with ID: ${groupId}`);
  } catch (e) {
    console.error("Error adding member to group: ", e);
    throw e;
  }
}

