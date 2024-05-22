import '@/app/globals.css';
import { member } from '@/dbopps';


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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </li>
      ))}
    </ul>
  );
}