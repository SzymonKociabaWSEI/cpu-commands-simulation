import type { AddressingMode, MemoryCell, Registers } from "./types";
import { calculateEffectiveAddress } from "./utils/calculateEffectiveAddress";
import { toHex } from "./utils/toHex";

export function MemoryGrid(props: {
  memory: MemoryCell[], 
  regs: Registers, 
  displacement: number,
  selectedAddrMode: AddressingMode
}) {
  const { memory, regs, displacement, selectedAddrMode } = props;
  
  const memoryCells = memory.map((m) => {
        const address = calculateEffectiveAddress(selectedAddrMode, displacement, regs);
        const isTargeted = m.address === address;
        return (
          <div 
            key={m.address} 
            className={`memory-cell ${isTargeted ? 'highlight' : ''}`}
            title={`Addr: ${toHex(m.address)}`}
          >
            <div style={{color:'#888', fontSize:'0.6rem'}}>{toHex(m.address, 2)}</div>
            <div style={{fontWeight:'bold', color: isTargeted ? '#fff' : '#4ec9b0'}}>{toHex(m.value, 2)}</div>
          </div>
        );
  }); 
  
  return (
    <div className="memory-grid">
      {memoryCells}
    </div>
  );
}