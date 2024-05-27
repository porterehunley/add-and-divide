'use client'

import { useState, useEffect, memo } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import BaseModal from '@/components/BaseModal';
import { ExpenseSection } from "@/components/ui/expenseSection";
import { 
  getGroupWithChildren,
  group,
  addMemberToGroup,
  member
} from '@/dbopps';
import ExpenseAdd from '@/components/ExpenseAdd';
import MemberSelection from '@/components/MemberSelection';
import CurrencyInput from 'react-currency-input-field';
import '@/app/globals.css';

export default function Group({ params }: { params: { id: string } }) {
  const groupId = params.id;
  const [groupData, setGroupData] = useState<group>();
  const [showMemberSelection, setShowMemberSelection] = useState<boolean>(false);
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<member>();
  const [sumTotal, setSumTotal] = useState<number>(0);

  const getGroupData = async () => {
    const data = await getGroupWithChildren(groupId);
    if (!data.members?.length) {
      setShowMemberSelection(true);
    }
    setGroupData(data);
  };

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

  useEffect(() => {
    const expenseTotal = groupData?.members?.flatMap(
      member => member.expenses
    ).map(
      expense => expense?.ammount ?? 0
    )?.reduce((prev, curr) => (prev+curr), 0);

    setSumTotal(expenseTotal);
  }, [groupData])

  useEffect(() => {
    if (groupId) {
      getGroupData();
    }
  }, [groupId])

  return (
    <main className="flex flex-col items-center justify-center 
      h-screen bg-[#f0f0f5] dark:bg-[#1a1a2e]">
      <div className="w-full h-full max-w-md p-6 bg-white rounded-lg 
        shadow-lg dark:bg-[#2c2c54]">
        <h1 className="text-2xl font-bold mb-4 text-center 
          text-[#6b5b95]">{groupData?.name}</h1>
        <div className="space-y-4">
          <div className="
            space-y-2 border-2 border-[#e6e6e6] 
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
          <div className="space-y-2">
            {groupData?.members?.map(member => (
              <ExpenseSection
                key={member.name}
                member={member}
                splitTotal={sumTotal / (groupData?.members?.length ?? 1)}/>
            ))}
          </div>
          <div className="border-t border-[#e6e6e6] dark:border-[#3c3c58] pt-4">
            <ExpenseAdd 
              groupId={groupId}
              memberId={selectedMember?.id}
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
          <div className="flex items-center gap-2 w-full pt-4 flex-col" >
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
    </main>
  );
}