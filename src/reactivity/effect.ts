import { extend } from "../shared";

let activeEffect = void 0;
let shouldTrack = false;

/* 可执行的 effect */
export class ReactiveEffect {
  private _fn: any;
  private active = true;
  public onStop = () => void 0;
  // 依赖的数据
  deps = [];
  constructor(fn, public scheduler?: any) {
    this._fn = fn;
  }
  run() {
    if (!this.active) {
      return this._fn();
    }
    shouldTrack = true;
    activeEffect = this as any;
    const result = this._fn();
    // 重置
    shouldTrack = false;
    activeEffect = undefined;
    return result;
  }
  stop() {
    // 反复调用 stop 优化
    if (this.active) {
      cleanupEffect(this);
      this.onStop?.();
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

const targetMap = new WeakMap();

export function track(target, key) {
  if (!isTracking()) return;
  // target => key => deps
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  trackEffect(dep);
}

/* fix：优化重复添加 */
export function trackEffect(dep) {
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    (activeEffect as any).deps.push(dep);
  }
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) return;
  let deps = depsMap.get(key);
  if (!deps) return;
  triggerEffects(deps);
}

export function triggerEffects(effects) {
  for (const effect of effects) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function effect(fn, options: any = {}) {
  /*   
    const { scheduler, onStop } = options;
    _effect.scheduler = scheduler;
    _effect.onStop = onStop; 
  */
  let _effect = new ReactiveEffect(fn);
  extend(_effect, options);
  _effect.run();
  /* 返回的 runner */
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
