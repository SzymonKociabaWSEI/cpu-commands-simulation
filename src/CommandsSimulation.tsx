import type { AddressingMode, Registers } from "./types";

export function CommandsSimulation(props: {
  regs: Registers,
  selectedAddresingMode: AddressingMode,
  setSelectedAddresingMode: (mode: AddressingMode) => void,
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
  executeMovMemToReg: (target: keyof Registers, mode: AddressingMode) => void,
  executeMovRegToMem: (source: keyof Registers, mode: AddressingMode) => void,
}) {
  const {
    selectedAddresingMode, setSelectedAddresingMode,
    selectedMovSourceReg, setSelectedMovSourceReg,
    selectedMovTargetReg, setSelectedMovTargetReg,
    selectedXchgSourceReg, setSelectedXchgSourceReg,
    selectedXchgTargetReg, setSelectedXchgTargetReg,
    movRegs,
    executeMovRegToReg, executeXchgRegReg,
    executeMovMemToReg, executeMovRegToMem
  } = props;

  // Lista poprawnych trybów (stała)
  const validAddressingModes: AddressingMode[] = [
    'BX', 'BP', 'SI', 'DI',
    'BX+SI', 'BX+DI',      
    'BP+SI', 'BP+DI'       
  ];

  return (
    <div className="controls-container">
      
      <div style={{borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '10px'}}>
        <h4 style={{marginTop: 0, color: '#4ec9b0'}}>Memory Operations (RAM ↔ Reg)</h4>
        
        <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px'}}>
           <div style={{display:'flex', flexDirection:'column'}}>
             <label style={{fontSize:'0.7rem'}}>Addr Mode:</label>
             <select 
                style={{padding: '5px', width: '120px'}} 
                value={selectedAddresingMode} 
                onChange={(e) => setSelectedAddresingMode(e.target.value as AddressingMode)}
              >
                {validAddressingModes.map(mode => (
                  <option key={mode} value={mode}>[{mode} + Disp]</option>
                ))}
              </select>
           </div>

           <div style={{display:'flex', flexDirection:'column'}}>
             <label style={{fontSize:'0.7rem'}}>Register:</label>
             <select 
                style={{padding: '5px'}} 
                value={selectedMovSourceReg} 
                onChange={(e) => setSelectedMovSourceReg(e.target.value as keyof Registers)}
              >
                {movRegs.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
           </div>
        </div>

        <div className="btn-group">
          <button onClick={() => executeMovMemToReg(selectedMovSourceReg, selectedAddresingMode)}>
             MOV {selectedMovSourceReg}, [{selectedAddresingMode}+Disp]
          </button>

          <button onClick={() => executeMovRegToMem(selectedMovSourceReg, selectedAddresingMode)}>
             MOV [{selectedAddresingMode}+Disp], {selectedMovSourceReg}
          </button>
        </div>
      </div>

      <div style={{borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '10px'}}>
        <h4 style={{marginTop: 0, color: '#4ec9b0'}}>Register Operations (MOV)</h4>
        <div style={{display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px'}}>
          <label>From:</label>
          <select 
            value={selectedMovSourceReg} 
            onChange={(e) => setSelectedMovSourceReg(e.target.value as keyof Registers)}
          >
            {movRegs.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          
          <label>To:</label>
          <select 
            value={selectedMovTargetReg} 
            onChange={(e) => setSelectedMovTargetReg(e.target.value as keyof Registers)}
          >
             {movRegs.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          
          <button onClick={() => executeMovRegToReg(selectedMovTargetReg, selectedMovSourceReg)}>MOV</button>
        </div>
      </div>

      <div>
        <h4 style={{marginTop: 0, color: '#4ec9b0'}}>Exchange (XCHG)</h4>
        <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
          <select 
            value={selectedXchgSourceReg} 
            onChange={(e) => setSelectedXchgSourceReg(e.target.value as keyof Registers)}
          >
            {movRegs.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <span>↔</span>
          <select 
            value={selectedXchgTargetReg} 
            onChange={(e) => setSelectedXchgTargetReg(e.target.value as keyof Registers)}
          >
            {movRegs.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <button onClick={() => executeXchgRegReg(selectedXchgTargetReg, selectedXchgSourceReg)}>XCHG</button>
        </div>
      </div>

    </div>
  );
}