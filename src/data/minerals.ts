import { MineralDefinition } from '@/types';
import mineralsData from './minerals.json';

export const MINERALS_DATABASE: MineralDefinition[] = mineralsData as unknown as MineralDefinition[];
