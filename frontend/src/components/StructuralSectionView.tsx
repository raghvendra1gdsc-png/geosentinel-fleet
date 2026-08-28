import type { MissionState } from '../types/mission';
import { AppleScrollStory } from './AppleScrollStory';

interface StructuralSectionViewProps {
  missionState: MissionState | null;
  stage?: string;
}

export function StructuralSectionView({ missionState, stage }: StructuralSectionViewProps) {
  return (
    <AppleScrollStory missionState={missionState} stage={stage} />
  );
}
