'use client'

import { useState, useEffect, Suspense, lazy } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import BaseModal from '@/components/BaseModal';
import { 
  getGroupWithChildren,
  group,
  addMemberToGroup,
  addGroupRefToDeviceIfAbsent,
  member,
  expense,
  markGroupAsSettled,
  markMemberAsSettled,
  markMemberAsNotSettled,
  markGroupAsNotSettled,
  deleteAllTransactionsInGroup,
  createTransaction
} from '@/dbopps';
import ExpenseAdd from '@/components/ExpenseAdd';
import MemberSelection from '@/components/MemberSelection';
import '@/app/globals.css';
import ExpenseDeck from '@/components/ui/ExpenseDeck';
import Skeleton from '@/components/ui/Skeleton';
import HomeIcon from '@/components/ui/HomeIcon';
import { useRouter } from 'next/navigation';
import { getOrSetDeviceData } from '@/device';
import { minimizeTransactions } from '@/calculator';
import TransactionsView from '@/components/ui/TransactionsView';

export default function Group({ params }: { params: { id: string } }) {
  const groupId = params.id;
  const [groupData, setGroupData] = useState<group>();
  const [showMemberSelection, setShowMemberSelection] = useState<boolean>(false);
  const [showComplete, setShowComplete] = useState<boolean>(false);
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<member>();
  const [sumTotal, setSumTotal] = useState<number>(0);
  const [isSettling, setIsSettling] = useState<boolean>(false);
  const router = useRouter();

  const getGroupData = async () => {
    const data = await getGroupWithChildren(groupId);
    if (!data.members?.length) {
      setShowMemberSelection(true);
    }
    const deviceId = getOrSetDeviceData();
    addGroupRefToDeviceIfAbsent(deviceId, data.name, groupId);
    setGroupData(data);
  };

  const addExpenseToGroupData = async (expense: expense) => {
    if (!selectedMember || !groupData?.name) {
      return 
    }

    const updatedGroupData = { 
      ...groupData, 
      members: groupData?.members?.map(member => 
        member.id === selectedMember.id 
          ? { ...member, expenses: [...(member.expenses || []), expense] } 
          : member
      ) 
    };

    setGroupData(updatedGroupData);
  }

  const addNewMemberClick = async (name: string) => {
    if (groupData === undefined) {
      return
    }

    const newMember = await addMemberToGroup(groupId, name);
    const updatedGroupData = { 
      ...groupData, 
      id: groupData?.id || groupId, // Ensure id is always a string
      members: [...(groupData?.members || []), newMember] 
    };
    setGroupData(updatedGroupData);
  }

  const settleMemberClick = async () => {
    if (!selectedMember?.id || !groupData?.name) {
      return;
    }

    setIsSettling(true);
    if (selectedMember?.isSettled) {
      await markMemberAsNotSettled(groupId, selectedMember.id);
      let updatedGroupData = { 
        ...groupData, 
        members: groupData?.members?.map(member => 
          member.id === selectedMember.id 
            ? { ...member, isSettled: false } 
            : member
        ) 
      };

      setSelectedMember({...selectedMember, isSettled: false})

      const unsettledMembers = updatedGroupData?.members?.filter(
        member => !member.isSettled
      );

      if (unsettledMembers?.length === 1) {
        await Promise.all([
          markGroupAsNotSettled(groupId),
          deleteAllTransactionsInGroup(groupId)
        ]);
        updatedGroupData = {...updatedGroupData, isComplete: false};
      }

      setGroupData(updatedGroupData);
      setIsSettling(false);
      return;
    }

    await markMemberAsSettled(groupId, selectedMember.id);
    let updatedGroupData = { 
      ...groupData, 
      members: groupData?.members?.map(member => 
        member.id === selectedMember.id 
          ? { ...member, isSettled: true } 
          : member
      ) 
    };

    const allMembersSettled = updatedGroupData?.members?.every(
      member => member.isSettled
    );
    if (allMembersSettled) {
      const opps = minimizeTransactions(updatedGroupData.members ?? []).map(transaction => (
        createTransaction(
          groupId, transaction.from, transaction.to, transaction.amount
        )
      ));
      await markGroupAsSettled(groupId);
      const res = await Promise.all(opps);
      updatedGroupData = {...updatedGroupData, isComplete: true, transactions: res};
    }

    setSelectedMember({...selectedMember, isSettled: true})

    setGroupData(updatedGroupData);
    setIsSettling(false);
  }

  useEffect(() => {
    const expenseTotal = groupData?.members?.flatMap(
      member => member.expenses
    ).map(
      expense => expense?.amount ?? 0
    )?.reduce((prev, curr) => (prev+curr), 0);

    setSumTotal(expenseTotal ?? 0);
  }, [groupData])

  useEffect(() => {
    setShowComplete(groupData?.isComplete ?? false);
  }, [groupData?.isComplete])

  useEffect(() => {
    if (groupId) {
      getGroupData();
    }
  }, [groupId])

  return (
    <main className="flex flex-col items-center justify-center 
      h-screen bg-[#f0f0f5] dark:bg-[#1a1a2e]">
      <div className="w-full flex flex-col h-screen max-w-md p-6 bg-white rounded-lg 
        shadow-lg dark:bg-[#2c2c54]">
        <div className='shrink-0'>
          <div className='flex-row flex justify-between items-center mb-4'>
            <HomeIcon className='h-7 w-7 mr-4' onClick={(e) => router.push('/newGroup')}/>
            {groupData?.name ? 
              <div className='max-w-80'>
                <h1 className="text-2xl font-bold 
              text-[#6b5b95]">{groupData?.name}
                </h1>
              </div> :
              <Skeleton style={{height: 38, width: '100%' }}/>}
          </div>
          
          <div className="
            space-y-2 border-2 border-[#e6e6e6] mb-4 
            dark:border-[#3c3c58] bg-[#f0f0f5] 
            dark:bg-[#2c2c54] p-2 rounded-lg flex align-center
            justify-between cursor-pointer"
            onClick={() => setShowMemberSelection(true)}>
            <p className="text-m text-left text-[#6b5b95]">
              {selectedMember ? selectedMember.name : 'Select Member'}
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#6b5b95] cursor-pointer"
              style={{ marginTop: 0 }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-2 overflow-scroll">
          <ExpenseDeck 
            members={groupData?.members}
            splitTotal={sumTotal / (groupData?.members?.length ?? 1)}/>
        </div>

        <div className="mt-auto dark:border-[#3c3c58]">
          <Button 
            disabled={!selectedMember}
            isLoading={isSettling}
            onClick={(e)=>settleMemberClick()}
            className='mb-4 w-full bg-[#9370db] hover:bg-[#8258fa] text-white'>
          {selectedMember?.isSettled ? 'Add More' : 'Settle Balance'}
          </Button>
          <div className='border-t border-[#e6e6e6] pt-4'>
            <ExpenseAdd 
              groupId={groupId}
              memberId={selectedMember?.id}
              onExpenseAdd={addExpenseToGroupData}
            />
          </div>
        </div>
      </div>

      <BaseModal
        isOpen={showMemberSelection}
        title={"Who are you?"}
        onRequestClose={() => setShowMemberSelection(false)}>
        <div className="flex items-center gap-2 flex-col">
          <MemberSelection 
            members={groupData?.members || []}
            setSelectedMember={(member: member) => {
              setSelectedMember(member);
              setShowMemberSelection(false);
            }}/>
          <div className="flex items-center gap-2 w-full pt-4 flex-col">
            <Input
              className="border-[#e6e6e6] dark:border-[#3c3c58] bg-[#f0f0f5] dark:bg-[#2c2c54] text-[#6b5b95]"
              placeholder="Add Member"
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
            />
            <Button 
              onClick={()=>addNewMemberClick(newMemberName)}
              disabled={!newMemberName.trim()}
              className="bg-[#9370db] hover:bg-[#8258fa] text-white">
              Add
            </Button>
          </div>
        </div>
      </BaseModal>

      <BaseModal
        isOpen={showComplete}
        onRequestClose={() => setShowComplete(false)}
        title={'This group is complete'}>
        <TransactionsView transactions={groupData?.transactions ?? []}/>
      </BaseModal>
    </main>
  );
}