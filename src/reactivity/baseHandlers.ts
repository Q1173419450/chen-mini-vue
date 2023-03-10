import { extend, isObject } from "../shared/index";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlag, readonly } from "./reactive";

function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key) {
    // console.log(key);
    if (key === ReactiveFlag.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlag.IS_READONLY) {
      return isReadonly;
    }
    let res = Reflect.get(target, key);

    /* 第一层使用 reactive */
    if (isShallow) {
      return res;
    }

    /* 全部使用 reactive */
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    /* reactive 才需要依赖收集 */
    if (!isReadonly) {
      track(target, key);
    }

    return res;
  };
}

function createSetter() {
  return function set(target, key, value) {
    let res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}

const get = createGetter();
const set = createSetter();
export const mutableHandlers = {
  get,
  set,
};

const readonlyGet = createGetter(true);
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    // readonly 的响应式对象不可以修改值
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true;
  },
};

const shallowGet = createGetter(true, true);
export const shallowHandlers = extend({}, readonlyHandlers, {
  get: shallowGet,
});
