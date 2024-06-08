import { GroupReference } from "@/dbopps";
import Skeleton from '@/components/ui/Skeleton'
import GroupSection from "./GroupSection";

export interface GroupsDeckProps {
  groups?: GroupReference[],
}

export default function GroupsDeck({groups}: GroupsDeckProps) {
  if (groups === undefined) {
    return (
      [...new Array(6)].map(x => (
        <Skeleton key={x} style={{width: '100%', height: 30}}/>
      ))
    );
  }

  return (
    <>
    {groups.map(groupRef => (
      <GroupSection key={groupRef.groupId} group={groupRef} />
    ))}
    </>
  );
}