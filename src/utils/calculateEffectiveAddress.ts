import type { Registers, AddressingMode } from '../types';

export const calculateEffectiveAddress = (
  mode: AddressingMode,
  displacement: number, 
  regs: Registers
): number => {
  let addr = displacement;

  if (mode.includes('BX')) addr += regs.BX;
  if (mode.includes('BP')) addr += regs.BP;
  if (mode.includes('SI')) addr += regs.SI;
  if (mode.includes('DI')) addr += regs.DI;

  return addr % 64;
};