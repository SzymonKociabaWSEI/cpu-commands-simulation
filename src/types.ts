export type Registers = {
  AX: number; BX: number; CX: number; DX: number; // General
  BP: number; SI: number; DI: number;             // Addressing
};

export type MemoryCell = {
  address: number;
  value: number;
};

export type AddressingMode = 'BX' | 'BP' | 'SI' | 'DI' | 'BX+SI' | 'BX+DI' | 'BP+SI' | 'BP+DI';