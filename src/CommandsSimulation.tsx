import type { Registers } from "./types";

export function CommandsSimulation(props: {
  regs: Registers, 
  selectedReg: keyof Registers, 
  setSelectedReg: (reg: keyof Registers) => void,
  selectedMovSourceReg: keyof Registers,
  setSelectedMovSourceReg: (reg: keyof Registers) => void,
  selectedMovTargetReg: keyof Registers,
  setSelectedMovTargetReg: (reg: keyof Registers) => void,
  selectedXchgSourceReg: keyof Registers,
  setSelectedXchgSourceReg: (reg: keyof Registers) => void,
  selectedXchgTargetReg: keyof Registers,
  setSelectedXchgTargetReg: (reg: keyof Registers) => void,
  movRegs: string[],
  executeMovRegToReg: (target: keyof Registers, source: keyof Registers) => void,
  executeXchgRegReg: (r1: keyof Registers, r2: keyof Registers) => void,
  executeMovMemToReg: (reg: keyof Registers, mode: string) => void,
  executeMovRegToMem: (reg: keyof Registers) => void,
}) {
  const {
    regs, 
    selectedReg, 
    setSelectedReg, 
    selectedMovSourceReg, 
    setSelectedMovSourceReg, 
    selectedMovTargetReg, 
    setSelectedMovTargetReg, 
    selectedXchgSourceReg, 
    setSelectedXchgSourceReg, 
    selectedXchgTargetReg, 
    setSelectedXchgTargetReg, 
    movRegs, 
    executeMovRegToReg, 
    executeXchgRegReg, 
    executeMovMemToReg, 
    executeMovRegToMem
  } = props;

  return (
    <> 
    <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
      <label>Target/Source Reg:</label>
      <select 
        style={{padding: '5px'}} 
        value={selectedReg} 
        onChange={(e) => setSelectedReg(e.target.value as keyof Registers)}
      >
        {Object.keys(regs).map(k => <option key={k} value={k}>{k}</option>)}
      </select>
      
      
  </div>
  <div className="btn-group">
             <button onClick={() => executeMovMemToReg(selectedMovSourceReg, 'BX+Disp')}>MOV {selectedMovSourceReg}, [BX+Disp]</button>
             <button onClick={() => executeMovRegToMem(selectedMovSourceReg)}>MOV [BX+Disp], {selectedMovSourceReg}</button>
          </div>
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
     </>
  );
}
