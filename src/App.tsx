import { useState } from 'react';
import './App.css';

type Registers = {
  AX: number;
  BX: number;
  CX: number;
  DX: number;
};

type MemoryCell = {
  address: number;
  value: number;
};

function App() {
  const [registers, setRegisters] = useState<Registers>({
    AX: 0, BX: 0, CX: 0, DX: 0
  });
  const [memory, setMemory] = useState<MemoryCell[]>(
    Array.from({ length: 64 }, (_, i) => ({ address: i, value: 0 }))
  );
  const [stack, setStack] = useState<number[]>([]);
  const [logs, setLogs] = useState<string[]>(["System initialized."]);

  const toHex = (num: number, padding: number = 2) => 
    `0x${num.toString(16).toUpperCase().padStart(padding, '0')}`;

  const logAction = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 10));

  // --- LOGIKA KOMEND (MIEJSCE DLA CIEBIE) ---
  // Przykładowa implementacja MOV AX, 1234 (wstawienie wartości do rejestru)
  const handleMovAxImmediate = () => {
    const newVal = Math.floor(Math.random() * 65535); // Losowa wartość dla demo
    
    setRegisters(prev => ({ ...prev, AX: newVal }));
    logAction(`MOV AX, ${toHex(newVal, 4)}`);
  };
  // Przykładowa implementacja PUSH AX (odłożenie AX na stos)
  const handlePushAx = () => {
    setStack(prev => [...prev, registers.AX]);
    logAction(`PUSH AX (${toHex(registers.AX, 4)})`);
  };
  // Przykładowa implementacja POP BX (zdjęcie ze stosu do BX)
  const handlePopBx = () => {
    if (stack.length === 0) {
      logAction("Error: Stack Underflow!");
      return;
    }
    const val = stack[stack.length - 1];
    setStack(prev => prev.slice(0, -1)); // Usuń ostatni element
    setRegisters(prev => ({ ...prev, BX: val })); // Wpisz do BX
    logAction(`POP BX (Loaded ${toHex(val, 4)})`);
  };

  return (
    <div className="simulator-container">
      
      <div className="panel">
        <h2>CPU Registers (16-bit)</h2>
        <div className="register-row">
          <span>AX:</span> <span>{toHex(registers.AX, 4)}</span>
        </div>
        <div className="register-row">
          <span>BX:</span> <span>{toHex(registers.BX, 4)}</span>
        </div>
        <div className="register-row">
          <span>CX:</span> <span>{toHex(registers.CX, 4)}</span>
        </div>
        <div className="register-row">
          <span>DX:</span> <span>{toHex(registers.DX, 4)}</span>
        </div>

        <hr style={{borderColor: '#444', width: '100%', margin: '20px 0'}} />

        <h2>Control Unit</h2>
        <div className="controls">
          <button onClick={handleMovAxImmediate}>MOV AX, [Random]</button>
          <button onClick={handlePushAx}>PUSH AX</button>
          <button onClick={handlePopBx}>POP BX</button>
          <button onClick={() => {
             setRegisters({AX:0, BX:0, CX:0, DX:0});
             setStack([]);
             logAction("RESET");
          }} style={{backgroundColor: '#c70039'}}>RESET</button>
        </div>

        <div style={{marginTop: 'auto', paddingTop: '20px', fontSize: '0.8rem', color: '#888'}}>
          <h3>Last Operations:</h3>
          {logs.map((log, i) => <div key={i}>{log}</div>)}
        </div>
      </div>

      <div className="panel">
        <h2>Memory Map (RAM)</h2>
        <div className="memory-grid">
          {memory.map((cell) => (
            <div key={cell.address} className="memory-cell">
              <span className="cell-addr">{toHex(cell.address)}</span>
              <span className="cell-val">{toHex(cell.value)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Stack Segment</h2>
        {stack.length === 0 ? (
          <div style={{color: '#555', fontStyle: 'italic'}}>Stack is empty</div>
        ) : (
          <div className="stack-list">
            {stack.map((val, idx) => (
              <div key={idx} className="stack-item">
                {toHex(val, 4)}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default App;