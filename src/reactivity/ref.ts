import { hasChange, isObject } from "../shared/index";
import { isTracking, trackEffect, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any;
  private _rawValue: any;
  public dep;
  public __v_isRef = true;
  constructor(value) {
    this._value = convert(value);
    this._rawValue = value;
    this.dep = new Set();
  }
  get value() {
    // 收集依赖
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    if (hasChange(this._rawValue, newValue)) {
      this._value = convert(newValue);
      this._rawValue = newValue;
      // 触发依赖
      triggerRefValue(this);
    }
  }
}

export function ref(value) {
  return createRef(value);
}

export function isRef(value) {
  return !!value.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

const shallowUnwrapHandlers = {
  get(target, key) {
    return unRef(Reflect.get(target, key));
  },
  set(target, key, value) {
    const oldValue = target[key];
    console.log(oldValue, value);
    // 将新值放到 ref 的 value 中
    if (isRef(oldValue) && !isRef(value)) {
      return (oldValue.value = value);
    } else {
      return Reflect.set(target, key, value);
    }
  },
};

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, shallowUnwrapHandlers);
}

function createRef(value: any) {
  const ref = new RefImpl(value);
  return ref;
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffect(ref.dep);
  }
}

function triggerRefValue(ref: any) {
  triggerEffects(ref.dep);
}

function convert(value: any): any {
  return isObject(value) ? reactive(value) : value;
}
