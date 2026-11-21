import { MODULES_PHASE_1_2 } from "./modulesPhase1_2";
import { MODULES_PHASE_3_4 } from "./modulesPhase3_4";
import type { ModuleItem } from "./modulesTypes";

export {
  MODULE_PHASES,
  type EvidenceStrength,
  type ModuleApproach,
  type ModuleItem,
  type ModulePhaseMeta,
  type ModulePracticeLink,
  type ModuleReference,
  type ModuleSection,
} from "./modulesTypes";

export const MODULES_DATA: ModuleItem[] = [
  ...MODULES_PHASE_1_2,
  ...MODULES_PHASE_3_4,
];

export function getModuleById(id: string): ModuleItem | undefined {
  return MODULES_DATA.find((m) => m.id === id);
}
