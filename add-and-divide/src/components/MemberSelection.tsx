import '@/app/globals.css';
import { member } from '@/dbopps';


interface MemberSelectionProps {
  members: member[];
}

export default function MemberSelection({ members }: MemberSelectionProps) {

  return (
    <ul className="list-disc list-inside">
      {members.map((member, index) => (
        <li key={index} className="cursor-pointer text-blue-500 hover:underline">
          {member.name}
        </li>
      ))}
    </ul>
  );
}