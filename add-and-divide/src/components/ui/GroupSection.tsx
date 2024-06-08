import { GroupReference } from "@/dbopps";
import { useRouter } from "next/navigation";

export interface GroupSectionProps {
  group: GroupReference 
}

export default function GroupSection({group}: GroupSectionProps) {
  const router = useRouter();

  return (
    <div className="border-t border-[#e6e6e6] pb-4">
      <h2 className="text-md text-[#6b5b95]">
        {group.name}
      </h2>
    </div>
  );
}