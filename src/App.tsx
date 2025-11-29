import React, { useState, useEffect } from 'react';
import './App.css';

// --- TYPY DANYCH ---

type Registers = {
  AX: number; BX: number; CX: number; DX: number; // General
  BP: number; SI: number; DI: number;             // Addressing
};

type MemoryCell = {
  address: number;
  value: number;
};

// --- HELPERY ---
const toHex = (num: number, padding: number = 4) => 
  `0x${num.toString(16).toUpperCase().padStart(padding, '0')}`;

const parseHex = (val: string): number => parseInt(val, 16) || 0;

function App() {
  // --- STATE ---

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

  const [movXchgValue, setMovXchgValue] = useState<number>(0); 

  const [selectedMovSourceReg, setSelectedMovSourceReg] = useState<keyof Registers>('AX');
  const [selectedMovTargetReg, setSelectedMovTargetReg] = useState<keyof Registers>('BX');
  const [selectedXchgSourceReg, setSelectedXchgSourceReg] = useState<keyof Registers>('AX');
  const [selectedXchgTargetReg, setSelectedXchgTargetReg] = useState<keyof Registers>('BX');
  const [selectedStackSourceReg, setSelectedStackSourceReg] = useState<keyof Registers>('AX');
  
  const [logs, setLogs] = useState<string[]>(["Symulator gotowy."]);

  const calculateEffectiveAddress = (mode: 'BX' | 'BP' | 'SI' | 'DI' | 'BX+SI' | 'BX+DI' | 'BP+SI' | 'BP+DI') => {
    let addr = displacement; 
    
    if (mode.includes('BX')) addr += regs.BX;
    if (mode.includes('BP')) addr += regs.BP;
    if (mode.includes('SI')) addr += regs.SI;
    if (mode.includes('DI')) addr += regs.DI;

    return addr % 64; 
  };

  const log = (msg: string) => setLogs(prev => [`> ${msg}`, ...prev]);

  const handleRegChange = (key: keyof Registers, value: string) => {
    setRegs(prev => ({ ...prev, [key]: parseHex(value) }));
  };

  const executeMovRegToReg = (target: keyof Registers, source: keyof Registers) => {
    setRegs(prev => ({ ...prev, [target]: prev[source], [source]: 0 }));
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

  const executeMovMemToReg = (target: keyof Registers, addrMode: string) => {
    const ea = (regs.BX + displacement) % 64;
    const memVal = memory.find(m => m.address === ea)?.value || 0;
    
    setRegs(prev => ({ ...prev, [target]: memVal }));
    log(`MOV ${target}, [${addrMode}] (Addr: ${toHex(ea)}, Val: ${toHex(memVal)})`);
  };

  const executeMovRegToMem = (source: keyof Registers) => {
    const ea = (regs.BX + displacement) % 64; // Przykład dla BX
    const val = regs[source];
    
    setMemory(prev => prev.map(cell => 
      cell.address === ea ? { ...cell, value: val } : cell
    ));
    log(`MOV [BX+Disp], ${source} (Addr: ${toHex(ea)}, Val: ${toHex(val)})`);
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
          {['AX', 'BX', 'CX', 'DX'].map((r) => (
            <div key={r} className="input-group">
              <label>{r}</label>
              <input 
                type="text" 
                maxLength={4}
                value={regs[r as keyof Registers].toString(16).toUpperCase()}
                onChange={(e) => handleRegChange(r as keyof Registers, e.target.value)}
              />
            </div>
          ))}

          <h3>Addressing & Index</h3>
                    <div style={{background: '#2d2d2d', padding: '10px', borderRadius: '4px', marginBottom: '20px'}}>
                        <div className="input-group">
              <label>Offset:</label>
              <input 
                type="text" 
                value={displacement.toString(16).toUpperCase()}
                onChange={(e) => setDisplacement(parseHex(e.target.value))}
              />
            </div>
            <div style={{fontSize: '0.8rem', marginTop: '10px', color: '#4ec9b0', textAlign: 'center'}}>
              Preview (BX + Disp): <strong>{toHex((regs.BX + displacement) % 64)}</strong>
            </div>
          </div>
          {['BX', 'BP', 'SI', 'DI'].map((r) => (
            <div key={r} className="input-group">
              <label>{r}</label>
              <input 
                type="text" 
                maxLength={4}
                value={regs[r as keyof Registers].toString(16).toUpperCase()}
                onChange={(e) => handleRegChange(r as keyof Registers, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>Operations</h2>
          <h3>Commands Simulation</h3>
          {/* <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
             <label>Target/Source Reg:</label>
             <select 
                style={{padding: '5px'}} 
                value={selectedReg} 
                onChange={(e) => setSelectedReg(e.target.value as keyof Registers)}
             >
               {Object.keys(regs).map(k => <option key={k} value={k}>{k}</option>)}
             </select>
          </div> */}

  
          <div className="btn-group">
            <label>From</label>
            <select 
                style={{padding: '5px'}} 
                value={selectedMovSourceReg} 
                onChange={(e) => setSelectedMovSourceReg(e.target.value as keyof Registers)}
             >
               {Object.values(movRegs).map(k => <option key={k} value={k}>{k}</option>)}
             </select>
            <label>To</label>
            <select 
                style={{padding: '5px'}} 
                value={selectedMovTargetReg} 
                onChange={(e) => setSelectedMovTargetReg(e.target.value as keyof Registers)}
             >
               {Object.values(movRegs).map(k => <option key={k} value={k}>{k}</option>)}
             </select>
            <button onClick={() => executeMovRegToReg(selectedMovTargetReg, selectedMovSourceReg)}>MOV</button>
          </div>

                    <div className="btn-group">
            <label>Exchange</label>
            <select 
                style={{padding: '5px'}} 
                value={selectedXchgTargetReg} 
                onChange={(e) => setSelectedXchgTargetReg(e.target.value as keyof Registers)}
             >
               {Object.values(movRegs).map(k => <option key={k} value={k}>{k}</option>)}
             </select>
            <select 
                style={{padding: '5px'}} 
                value={selectedXchgSourceReg} 
                onChange={(e) => setSelectedXchgSourceReg(e.target.value as keyof Registers)}
             >
               {Object.values(movRegs).map(k => <option key={k} value={k}>{k}</option>)}
             </select>
            <button onClick={() => executeXchgRegReg(selectedXchgTargetReg, selectedXchgSourceReg)}>XCHG</button>
          </div>


          {/* <div className="btn-group">
             <button onClick={() => executeMovMemToReg(selectedReg, 'BX+Disp')}>MOV {selectedReg}, [BX+Disp]</button>
             <button onClick={() => executeMovRegToMem(selectedReg)}>MOV [BX+Disp], {selectedReg}</button>
          </div> */}

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

          <h3>Execution Log</h3>
          <div className="logs-console">
            {logs.map((l, i) => <div key={i} className="log-entry">{l}</div>)}
          </div>
        </div>

        <div className="panel">
          <h2>Memory & Stack</h2>
          
          {/* <h3>RAM (0x00 - 0x3F)</h3>
          <div className="memory-grid">
            {memory.map((m) => {
              // Podświetlenie komórki, na którą wskazuje BX + Disp
              const isTargeted = m.address === ((regs.BX + displacement) % 64);
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
            })}
          </div> */}

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