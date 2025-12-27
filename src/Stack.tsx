import type { Registers } from "./types";
import { toHex } from "./utils/toHex";

export function Stack(props: {
  selectedStackSourceReg: keyof Registers, 
  setSelectedStackSourceReg: (reg: keyof Registers) => void,
  movRegs: string[],
  executePush: (reg: keyof Registers) => void,
  stack: number[],
  setStack: React.Dispatch<React.SetStateAction<number[]>>,
  setRegs: React.Dispatch<React.SetStateAction<Registers>>,
  log: (msg: string) => void,
  regs: Registers
}) {
  const { 
    selectedStackSourceReg, 
    setSelectedStackSourceReg, 
    movRegs, 
    executePush, 
    stack, 
    setStack, 
    setRegs, 
    log, 
    regs 
  } = props;

  return (
    <div className="btn-group">
            <label>Stack</label>
            <select 
                style={{padding: '5px'}} 
                value={selectedStackSourceReg} 
                onChange={(e) => setSelectedStackSourceReg(e.target.value as keyof Registers)}
             >
               {Object.values(movRegs).map(k => <option key={k} value={k}>{k}</option>)}
             </select>
             <button onClick={() => executePush(selectedStackSourceReg)} className="secondary">PUSH {selectedStackSourceReg}</button>
             <button onClick={() => {
                if(stack.length > 0) {
                   const val = stack[stack.length-1];
                   setStack(s => s.slice(0,-1));
                   setRegs(prev => ({...prev, [selectedStackSourceReg]: val}));
                   log(`POP ${selectedStackSourceReg}: ${toHex(regs[selectedStackSourceReg])} from Stack`);
                }
             }} className="secondary">POP {selectedStackSourceReg}</button>
          </div>
  );
}