import {
  mutableHandlers,
  readonlyHandlers,
  shallowHandlers,
} from "./baseHandlers";

export const enum ReactiveFlag {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadOnly",
}

function createReactiveObject(target, baseHandlers) {
  const proxy = new Proxy(target, baseHandlers);
  return proxy;
}

export function reactive(target) {
  return createReactiveObject(target, mutableHandlers);
}

export function readonly(target) {
  return createReactiveObject(target, readonlyHandlers);
}

export function shallowReadonly(target) {
  return createReactiveObject(target, shallowHandlers);
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

export function isReactive(target) {
  return !!target[ReactiveFlag.IS_REACTIVE];
}

export function isReadonly(target) {
  return !!target[ReactiveFlag.IS_READONLY];
}
