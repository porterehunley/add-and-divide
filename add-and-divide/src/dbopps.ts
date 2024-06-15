import { app } from '@/firebase';
import { 
  addDoc, 
  updateDoc,
  collection, 
  getFirestore,
  runTransaction,
  doc,
  query,
  where,
  setDoc,
  getDocs,
  getDoc } from 'firebase/firestore';

export interface group {
  id?: string,
  name: string,
  isComplete?: boolean,
  members?: member[]
}

export interface member {
  id?: string,
  name: string,
  isSettled?: boolean,
  expenses?: expense[]
}

export interface expense {
  id?: string,
  ammount: number,
  title: string
}

export interface GroupReference {
  id?: string,
  groupId: string,
  name: string
}

const db = getFirestore(app);

export async function getDeviceGroups(deviceId: string): Promise<GroupReference[]> {
  try {
    const deviceRef = doc(db, "devices", deviceId);
    const groupsCollectionRef = collection(deviceRef, "groups");
    const groupsSnap = await getDocs(groupsCollectionRef);
    const groupDataPromises = groupsSnap.docs.map(async (groupDoc) => {
      return { id: groupDoc.id, ...groupDoc.data() } as GroupReference;
    });

    const groupsData = await Promise.all(groupDataPromises);
    console.log(groupsData);

    return groupsData;
  } catch (e) {
    console.error("Error fetching device groups: ", e);
    throw e;
  }
}

export async function markMemberAsSettled(groupId: string, memberId: string): Promise<void> {
  try {
    const memberRef = doc(db, "groups", groupId, "members", memberId);
    await updateDoc(memberRef, { isSettled: true });
    console.log(`Member ${memberId} in group ${groupId} marked as settled.`);
  } catch (e) {
    console.error("Error marking member as settled: ", e);
    throw e;
  }
}

export async function markMemberAsNotSettled(groupId: string, memberId: string): Promise<void> {
  try {
    const memberRef = doc(db, "groups", groupId, "members", memberId);
    await updateDoc(memberRef, { isSettled: false });
    console.log(`Member ${memberId} in group ${groupId} marked as not settled.`);
  } catch (e) {
    console.error("Error marking member as not settled: ", e);
    throw e;
  }
}

export async function markGroupAsSettled(groupId: string): Promise<void> {
  try {
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, { isComplete: true });
    console.log(`Group ${groupId} marked as settled.`);
  } catch (e) {
    console.error("Error marking group as settled: ", e);
    throw e;
  }
}

export async function markGroupAsNotSettled(groupId: string): Promise<void> {
  try {
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, { isComplete: false });
    console.log(`Group ${groupId} marked as not settled.`);
  } catch (e) {
    console.error("Error marking group as not settled: ", e);
    throw e;
  }
}

export async function addGroupRefToDeviceIfAbsent(
  deviceId: string, groupName: string, groupId: string): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      const deviceRef = doc(db, "devices", deviceId);
      const deviceSnap = await transaction.get(deviceRef);
      if (!deviceSnap.exists()) {
        transaction.set(deviceRef, {});
      }

      const groupsCollectionRef = collection(deviceRef, "groups");
      const existingGroupQuery = query(groupsCollectionRef, where("groupId", "==", groupId));
      const existingGroupSnap = await getDocs(existingGroupQuery);
      if (!existingGroupSnap.empty) {
        console.log(`Group with id ${groupId} already exists for device ${deviceId}`);
        return;
      }

      transaction.set(doc(groupsCollectionRef), { name: groupName, groupId: groupId });
      console.log(`Group name ${groupName} added to device ${deviceId}`);
    });
  } catch (e) {
    console.error("Error adding group name to device: ", e);
    throw e;
  }
}

export async function addExpenseToMember(
  groupId: string,
  memberId: string,
  expense: expense): Promise<void> {
  try {
    const memberRef = doc(db, "groups", groupId, "members", memberId);
    const expenseRef = collection(memberRef, "expenses");
    await addDoc(expenseRef, expense);
    console.log(`Expense added to member ${memberId} in group ${groupId}`);
  } catch (e) {
    console.error("Error adding expense to member: ", e);
    throw e;
  }
}


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
        const memberData = {id: memberDoc.id, ...memberDoc.data()} as member;
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

