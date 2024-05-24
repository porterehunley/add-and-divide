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
  addExpenseToMember,
  expense,
  member
} from '@/dbopps';
import MemberSelection from '@/components/MemberSelection';
import CurrencyInput from 'react-currency-input-field';
import '@/app/globals.css';

export default function Group({ params }: { params: { id: string } }) {
  const groupId = params.id;
  const [groupData, setGroupData] = useState<group>();
  const [showMemberSelection, setShowMemberSelection] = useState<boolean>(false);
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<member>();
  const [expenseAmmount, setExpenseAmmount] = useState<number>();
  const [expenseName, setExpenseName] = useState<string>();

  const getGroupData = async () => {
    const data = await getGroupWithChildren(groupId);
    if (!data.members?.length) {
      setShowMemberSelection(true);
    }
    setGroupData(data);
  };

  const validateValue = (value: string | undefined): void => {
    const rawValue = value === undefined ? 'undefined' : value;
    if (Number.isNaN(rawValue)) {
      return;
    }

    setExpenseAmmount(Number(rawValue));
  }

  const addExpenseClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const memberId = selectedMember?.id;
    if (!expenseName || !expenseAmmount || !memberId) {
      console.log("data not set");
      return
    }

    const expense: expense = {
      title: expenseName,
      ammount: expenseAmmount
    }

    await addExpenseToMember(groupId, memberId, expense);
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

  useEffect(() => {
    if (groupId) {
      getGroupData();
    }
  }, [groupId])

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-[#f0f0f5] dark:bg-[#1a1a2e]">
      <div className="w-full h-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-[#2c2c54]">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#6b5b95]">{groupData?.name}</h1>
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
          </div>
          <div className="border-t border-[#e6e6e6] dark:border-[#3c3c58] pt-4">
            <form className="space-y-4">
              <div className="flex items-center gap-2 flex-col">
                <Input
                  className="flex-1 border-[#e6e6e6] dark:border-[#3c3c58] 
                    bg-[#f0f0f5] dark:bg-[#2c2c54] text-[#6b5b95]"
                  placeholder="Expense Name"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  type="text"
                />
                <div className='w-full justify-between flex'>
                  <CurrencyInput 
                    placeholder="$42"
                    allowDecimals={false}
                    onValueChange={validateValue}
                    className='border border-[#e6e6e6] dark:border-[#3c3c58] 
                    bg-[#f0f0f5] dark:bg-[#2c2c54] text-[#6b5b95] px-3 py-2
                    rounded-md h-10 focus-visible:ring-2 focus-visible:ring-gray-950
                    ring-offset-white focus-visible:outline-none text-sm
                    focus-visible:ring-offset-2 placeholder:text-gray-400'
                    prefix={'$'}
                    step={10}
                  />
                  <Button
                    disabled={!expenseName?.trim() || !selectedMember?.id || !expenseAmmount}
                    onClick={(e) => addExpenseClick(e)}
                    className="bg-[#9370db] hover:bg-[#8258fa] text-white">Add</Button>
                </div>
              </div>
            </form>
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
            setSelectedMember={(member: member) => {setSelectedMember(member); setShowMemberSelection(false);}}/>
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