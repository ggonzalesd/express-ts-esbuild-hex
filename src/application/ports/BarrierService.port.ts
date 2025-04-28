export interface BarrierService {
  push: (scope: string, barrier: string) => void;
  dispatch: (scope: string, barrier: string) => void;
  on: (scope: string, callback: () => void) => void;
  off: (scope: string, callback: () => void) => void;
}
