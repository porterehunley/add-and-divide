'use client'

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import BaseModal from '@/components/BaseModal';
import { ExpenseSection } from "@/components/ui/expenseSection";
import { getGroupWithChildren, group, addMemberToGroup, member} from '@/dbopps';
import MemberSelection from '@/components/MemberSelection';
import '@/app/globals.css';

export default function Group({ params }: { params: { id: string } }) {
  const groupId = params.id;
  const [groupData, setGroupData] = useState<group>();
  const [showMemberSelection, setShowMemberSelection] = useState<boolean>(false);
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<member>();

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
            <p className="text-2m text-left text-[#6b5b95]">
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
              <div className="flex items-center gap-2">
                <Input
                  className="flex-1 border-[#e6e6e6] dark:border-[#3c3c58] bg-[#f0f0f5] dark:bg-[#2c2c54] text-[#6b5b95]"
                  placeholder="Add Expense"
                  type="text"
                />
                <Button className="bg-[#9370db] hover:bg-[#8258fa] text-white">Add</Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <BaseModal
        isOpen={showMemberSelection}
        title={"Who are you?"}
        onRequestClose={() => setShowMemberSelection(false)}>
        <div className="flex items-center gap-2">
          <MemberSelection members={groupData?.members || []}/>
          <Input
            className="flex-1 border-[#e6e6e6] dark:border-[#3c3c58] bg-[#f0f0f5] dark:bg-[#2c2c54] text-[#6b5b95]"
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
      </BaseModal>
    </main>
  );
}