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
  members?: member[]
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

export async function getGroupWithChildren(groupId: string): Promise<group> {
  try {
    const groupRef = doc(db, "groups", groupId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      throw new Error("Group not found");
    }

    const groupData = groupSnap.data() as group;
    const members = groupData.members || [];
    console.log(members);

    // Fetch all members and their expenses
    const membersWithExpenses: member[] = await Promise.all(
      members.map(async (member: member) => {
        const memberRef = doc(db, "members", member.id);
        const memberSnap = await getDoc(memberRef);

        if (!memberSnap.exists()) {
          throw new Error(`Member with ID ${member.id} not found`);
        }

        const memberData = memberSnap.data() as member;
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

              return expenseSnap.data() as expense;
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

export async function addMemberToGroup(groupId: string, memberName: string): Promise<member> {
  try {
    const groupRef = doc(db, "groups", groupId);
    const newMemberRef = await addDoc(collection(groupRef, "members"), {
      name: memberName,
    });
    console.log(`Member ${memberName} added to group with ID: ${groupId}`);
    return { id: newMemberRef.id, name: memberName };
  } catch (e) {
    console.error("Error adding member to group: ", e);
    throw e;
  }
}

