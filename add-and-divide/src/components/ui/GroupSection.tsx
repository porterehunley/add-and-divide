import { GroupReference } from "@/dbopps";
import { useRouter } from "next/navigation";
import RightChevronIcon from "./RigthChevronIcon";

export interface GroupSectionProps {
  group: GroupReference 
}

export default function GroupSection({group}: GroupSectionProps) {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push(`/group/${group.groupId}`)}
      className="border-t border-[#e6e6e6] py-4 cursor-pointer flex flex-row justify-between">
      <h2 className="text-md text-[#6b5b95] text-left">
        {group.name}
      </h2>
      <RightChevronIcon className='h-6 w-6 text-[#6b5b95] cursor-pointer' />
    </div>
  );
}