import { useState } from 'react';
import { type Registers, type MemoryCell, type AddressingMode } from './types';
import './App.css';
import { GeneralPurpose } from './GeneralPurpose';
import { AddresingAndIndex } from './AddresingAndIndex';
import { CommandsSimulation } from './CommandsSimulation';
import { Stack } from './Stack';
import { toHex } from './utils/toHex';
import { parseHex } from './utils/parseHex';
import { MemoryGrid } from './MemoryGrid';
import { calculateEffectiveAddress } from './utils/calculateEffectiveAddress';

function App() {
  const [regs, setRegs] = useState<Registers>({
    AX: 0, BX: 0, CX: 0, DX: 0,
    BP: 0, SI: 0, DI: 0
  });

  const movRegs = ['AX', 'BX', 'CX', 'DX'];

  const [displacement, setDisplacement] = useState<number>(0);

  const [memory, setMemory] = useState<MemoryCell[]>(
    Array.from({ length: 64 }, (_, i) => ({ address: i, value: 0 }))
  );

  const [stack, setStack] = useState<number[]>([]);

  const [selectedAddrMode, setSelectedAddrMode] = useState<AddressingMode>('BX');

  const [selectedMovSourceReg, setSelectedMovSourceReg] = useState<keyof Registers>('AX');
  const [selectedMovTargetReg, setSelectedMovTargetReg] = useState<keyof Registers>('BX');
  const [selectedXchgSourceReg, setSelectedXchgSourceReg] = useState<keyof Registers>('AX');
  const [selectedXchgTargetReg, setSelectedXchgTargetReg] = useState<keyof Registers>('BX');
  const [selectedStackSourceReg, setSelectedStackSourceReg] = useState<keyof Registers>('AX');
  
  const [logs, setLogs] = useState<string[]>(["Symulator gotowy."]);

  const log = (msg: string) => setLogs(prev => [`> ${msg}`, ...prev]);

  const handleRegChange = (key: keyof Registers, value: string) => {
    setRegs(prev => ({ ...prev, [key]: parseHex(value) }));
  };

  const executeMovRegToReg = (target: keyof Registers, source: keyof Registers) => {
    setRegs(prev => ({ ...prev, [target]: prev[source] }));
    log(`MOV ${target}, ${source} (Val: ${toHex(regs[source])})`);
  };

  const executeXchgRegReg = (r1: keyof Registers, r2: keyof Registers) => {
    setRegs(prev => ({
      ...prev,
      [r1]: prev[r2],
      [r2]: prev[r1]
    }));
    log(`XCHG ${r1}, ${r2}`);
  };

const executeMovMemToReg = (target: keyof Registers, mode: AddressingMode) => {
    const ea = calculateEffectiveAddress(mode, displacement, regs);
    const memVal = memory.find(m => m.address === ea)?.value || 0;
    setRegs(prev => ({ ...prev, [target]: memVal }));
    log(`MOV ${target}, [${mode}+Disp] (Addr: ${toHex(ea)}, Val: ${toHex(memVal)})`);
  };

const executeMovRegToMem = (source: keyof Registers, mode: AddressingMode) => {
    const ea = calculateEffectiveAddress(mode, displacement, regs);
    const val = regs[source];
    setMemory(prev => prev.map(cell => 
      cell.address === ea ? { ...cell, value: val } : cell
    ));

    log(`MOV [${mode}+Disp], ${source} (Addr: ${toHex(ea)}, Val: ${toHex(val)})`);
  };

  const executePush = (reg: keyof Registers) => {
    setStack(prev => [...prev, regs[reg]]);
    setRegs(prev => ({ ...prev, [reg]: 0 }));
    log(`PUSH ${reg}: ${toHex(regs[selectedStackSourceReg])} to Stack`);
  };

  return (
    <div className="simulator-wrapper">
      
      <div className="command-center">
        <div>
          <h1 style={{margin: 0, fontSize: '1.5rem'}}>8086</h1>
        </div>
        <div>
          <button className="secondary" onClick={() => {
            setRegs({AX:0,BX:0,CX:0,DX:0,BP:0,SI:0,DI:0}); 
            setDisplacement(0);
            log("RESET SYSTEM");
          }}>RESET ALL</button>
        </div>
      </div>

      <div className="main-grid">

        <div className="panel">
          <h2>Registers & Addressing</h2>
          <h3>General Purpose</h3>
          <GeneralPurpose handleRegChange={handleRegChange} regs={regs} />
          <h3>Addressing & Index</h3>
          <AddresingAndIndex handleRegChange={handleRegChange} regs={regs} displacement={displacement} setDisplacement={setDisplacement} />
        </div>

        <div className="panel">
          <h2>Operations</h2>
          <h3>Commands Simulation</h3>
          <CommandsSimulation 
            regs={regs}
            selectedMovSourceReg={selectedMovSourceReg}
            setSelectedMovSourceReg={setSelectedMovSourceReg}
            selectedMovTargetReg={selectedMovTargetReg}
            setSelectedMovTargetReg={setSelectedMovTargetReg}
            selectedXchgSourceReg={selectedXchgSourceReg}
            setSelectedXchgSourceReg={setSelectedXchgSourceReg}
            selectedXchgTargetReg={selectedXchgTargetReg}
            setSelectedXchgTargetReg={setSelectedXchgTargetReg}
            selectedAddresingMode={selectedAddrMode}
            setSelectedAddresingMode={setSelectedAddrMode}
            movRegs={movRegs}
            executeMovRegToReg={executeMovRegToReg}
            executeXchgRegReg={executeXchgRegReg} 
            executeMovMemToReg={executeMovMemToReg}
            executeMovRegToMem={executeMovRegToMem}
          /> 
          <Stack 
            selectedStackSourceReg={selectedStackSourceReg} 
            setSelectedStackSourceReg={setSelectedStackSourceReg}
            movRegs={movRegs}
            executePush={executePush}
            stack={stack}
            setStack={setStack}
            setRegs={setRegs}
            log={log}
            regs={regs} 
          />
          

          <h3>Execution Log</h3>
          <div className="logs-console">
            {logs.map((l, i) => <div key={i} className="log-entry">{l}</div>)}
          </div>
        </div>

        <div className="panel">
          <h2>Memory & Stack</h2>
          <h3>RAM (0x00 - 0x3F)</h3>
          <MemoryGrid memory={memory} regs={regs} displacement={displacement} />

          <h3 style={{marginTop: '20px'}}>Stack (LIFO)</h3>
          <div style={{display: 'flex', flexDirection: 'column-reverse', gap: '2px', height: '150px', overflowY: 'auto', border: '1px solid #333', padding: '5px'}}>
             {stack.map((s, i) => (
               <div key={i} style={{background: '#333', padding: '2px 5px', fontSize: '0.8rem', borderLeft: '3px solid var(--accent)'}}>
                 {toHex(s)}
               </div>
             ))}
             {stack.length === 0 && <span style={{color: '#555', fontStyle:'italic', padding: '5px'}}>Empty Stack</span>}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;