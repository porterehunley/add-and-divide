import { app } from '@/firebase';
import { 
  addDoc, 
  collection, 
  getFirestore,
  doc,
  updateDoc,
  getDocs,
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
    const membersCollectionRef = collection(groupRef, "members");
    const membersSnap = await getDocs(membersCollectionRef);
    const members = await Promise.all(
      membersSnap.docs.map(async (memberDoc) => {
        const memberData = memberDoc.data() as member;
        const expensesCollectionRef = collection(memberDoc.ref, "expenses");
        const expensesSnap = await getDocs(expensesCollectionRef);
        const expenses = expensesSnap.docs.map(expenseDoc => expenseDoc.data() as expense);
        return {
          ...memberData,
          expenses
        };
      })
    );

    return {
      ...groupData,
      members
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

