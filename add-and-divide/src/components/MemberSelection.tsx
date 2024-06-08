import '@/app/globals.css';
import { member } from '@/dbopps';
import RightChevronIcon from './ui/RigthChevronIcon';


interface MemberSelectionProps {
  members: member[];
  setSelectedMember: (member: member) => void;
}

export default function MemberSelection({ members, setSelectedMember }: MemberSelectionProps) {

  return (
    <ul className="list-disc list-inside w-full">
      <li className="border-b border-[#e6e6e6] dark:border-[#3c3c58] pb-4 list-none"/>
      {members.map((member, index) => (
        <li key={index} className="cursor-pointer text-[#6b5b95] list-none 
          border-b border-[#e6e6e6] dark:border-[#3c3c58] pt-4 pb-4
          flex justify-between"
          onClick={() => {setSelectedMember(member)}}>
          <p className="text-m text-left text-[#6b5b95]">
            {member.name}
          </p>
          <RightChevronIcon className='h-6 w-6 text-[#6b5b95] cursor-pointer' />
        </li>
      ))}
    </ul>
  );
}