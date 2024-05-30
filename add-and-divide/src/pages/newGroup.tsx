import { useState } from "react";
import { useRouter } from 'next/router'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createGroup } from "@/dbopps";
import '@/app/globals.css';


export default function NewGroup() {
  const [groupName, setGroupName] = useState<string>('');
  const router = useRouter();

  const onCreateClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const groupId = await createGroup(groupName);
    router.push(`/group/${groupId}`);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-[#f0f0f5] dark:bg-[#1a1a2e]">
      <div className="w-full h-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-[#2c2c54] flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#6b5b95]">Add&Divide</h1>
        <div className="space-y-2 flex-grow">
          <p className="text-lg text-center text-[#6b5b95]">
            A no-nonsense expense tracker for groups. Easy, free, and no overhead.
          </p>
        </div>
        <div className="border-t border-[#e6e6e6] dark:border-[#3c3c58] pt-4 flex-shrink-0">
          <form className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <Input
                className="border-[#e6e6e6] dark:border-[#3c3c58] bg-[#f0f0f5] dark:bg-[#2c2c54] text-[#6b5b95]"
                placeholder="Group Name"
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
                type="text"
              />
              <Button 
                className="w-full bg-[#9370db] hover:bg-[#8258fa] text-white" 
                disabled={!groupName}
                onClick={onCreateClick}
              >
                Create Group
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}