import type { Registers } from "./types";

export function GeneralPurpose(props: {handleRegChange: (key: keyof Registers, value: string) => void, regs: Registers}) {
  const {handleRegChange, regs} =  props;

  const registers = ['AX', 'BX', 'CX', 'DX'].map((r) => (
            <div key={r} className="input-group">
              <label>{r}</label>
              <input 
                type="text" 
                maxLength={4}
                value={regs[r as keyof Registers].toString(16).toUpperCase()}
                onChange={(e) => handleRegChange(r as keyof Registers, e.target.value)}
              />
            </div>
          ));

  return registers;
}