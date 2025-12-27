import type { Registers } from "../types";

type Mode = 'BX' | 'BP' | 'SI' | 'DI' | 'BX+SI' | 'BX+DI' | 'BP+SI' | 'BP+DI';

export function calculateEffectiveAddress (mode: Mode, displacement: number, regs: Registers) {
    let addr = displacement; 
    
    if (mode.includes('BX')) addr += regs.BX;
    if (mode.includes('BP')) addr += regs.BP;
    if (mode.includes('SI')) addr += regs.SI;
    if (mode.includes('DI')) addr += regs.DI;

    return addr % 64; 
};