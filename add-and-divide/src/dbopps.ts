import { app } from '@/firebase';
import { 
  addDoc, 
  collection, 
  getFirestore,
  doc,
  updateDoc,
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

