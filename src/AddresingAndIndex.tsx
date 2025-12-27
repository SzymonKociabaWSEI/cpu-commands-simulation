import type { Registers } from "./types";
import { parseHex } from "./utils/parseHex";
import { toHex } from "./utils/toHex";


export function AddresingAndIndex(props: {handleRegChange: (key: keyof Registers, value: string) => void, regs: Registers, displacement: number, setDisplacement: (d: number) => void}) {
  const {handleRegChange, regs, displacement, setDisplacement} = props;

  const registers = ['BX', 'BP', 'SI', 'DI'].map((r) => (
            <div key={r} className="input-group">
              <label>{r}</label>
              <input 
                type="text" 
                maxLength={4}
                value={regs[r as keyof Registers].toString(16).toUpperCase()}
                onChange={(e) => handleRegChange(r as keyof Registers, e.target.value)}
              />
            </div>
          ))

  return (
    <div style={{background: '#2d2d2d', padding: '10px', borderRadius: '4px', marginBottom: '20px'}}>
      <div className="input-group">
        <label>Offset:</label>
        <input 
          type="text" 
          value={displacement.toString(16).toUpperCase()}
          onChange={(e) => setDisplacement(parseHex(e.target.value))}
        />
      </div>
      <div style={{fontSize: '0.8rem', marginTop: '10px', marginBottom: '10px', color: '#4ec9b0', textAlign: 'center'}}>
        Preview (BX + Disp): <strong>{toHex((regs.BX + displacement) % 64)}</strong>
      </div>
      {registers}
    </div>
  );
}