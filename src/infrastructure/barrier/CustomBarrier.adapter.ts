import { container } from 'tsyringe';

import { DepBarrier } from '@@const/dependencies.enum';

import { BarrierService } from '@@app/ports/BarrierService.port';

export class CustomBarrierAdapter implements BarrierService {
  private memory: Map<
    string,
    { callbacks: Set<() => void>; barriers: Set<string> }
  >;

  constructor() {
    this.memory = new Map();
  }

  off(scope: string, callback: () => void) {
    const scopeData = this.memory.get(scope);

    if (!scopeData) {
      return;
    }

    scopeData.callbacks.delete(callback);
  }

  on(scope: string, callback: () => void) {
    if (!this.memory.has(scope)) {
      this.memory.set(scope, { callbacks: new Set(), barriers: new Set() });
    }

    const scopeData = this.memory.get(scope);

    if (!scopeData) {
      return;
    }

    if (scopeData.barriers.size > 0) {
      scopeData.callbacks.add(callback);
    } else {
      callback();
      scopeData.callbacks.forEach((cb) => cb());
      scopeData.callbacks.clear();
    }
  }

  push(scope: string, barrier: string) {
    if (!this.memory.has(scope)) {
      this.memory.set(scope, { callbacks: new Set(), barriers: new Set() });
    }

    const scopeData = this.memory.get(scope)!;
    scopeData.barriers.add(barrier);
  }

  dispatch(scope: string, barrier: string) {
    if (!this.memory.has(scope)) {
      return;
    }

    const scopeData = this.memory.get(scope)!;
    scopeData.barriers.delete(barrier);

    if (scopeData.barriers.size === 0) {
      scopeData.callbacks.forEach((callback) => callback());
      this.memory.delete(scope);
    }
  }
}

container.register<BarrierService>(DepBarrier.CUSTOM, {
  useValue: new CustomBarrierAdapter(),
});
