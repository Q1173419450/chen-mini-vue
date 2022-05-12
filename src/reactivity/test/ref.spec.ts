import { effect } from "../effect";
import { reactive } from "../reactive";
import { isRef, proxyRefs, ref, unRef } from "../ref";

describe("ref", () => {
  it("should be reactive", () => {
    let a = ref(1);
    let dummy;
    let fn = jest.fn(() => {
      dummy = a.value;
    });
    effect(fn);
    expect(fn).toBeCalledTimes(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(fn).toBeCalledTimes(2);
    expect(dummy).toBe(2);
    // repeat
    a.value = 2;
    expect(fn).toBeCalledTimes(2);
    expect(dummy).toBe(2);
  });
  it("should be object data is reactive", () => {
    let a = ref({
      count: 1,
    });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    a.value.count++;
    expect(dummy).toBe(2);
  });

  it("isRef", () => {
    // 判断是否是 ref 对象
    let a = ref(1);
    let b = 1;
    let c = reactive({
      e: 1,
    });
    expect(isRef(a)).toBe(true);
    expect(isRef(b)).toBe(false);
    expect(isRef(c)).toBe(false);
  });

  it("unRef", () => {
    let a = ref(1);
    let b = 1;
    expect(unRef(a)).toBe(1);
    expect(unRef(b)).toBe(1);
  });

  it("proxyRefs", () => {
    const user = {
      age: ref(10),
      name: "xiaohong",
    };
    const proxyUser = proxyRefs(user);
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    (proxyUser as any).age = 20;
    expect(user.age.value).toBe(20);
    expect(proxyUser.age).toBe(20);

    proxyUser.age = ref(30);
    expect(user.age.value).toBe(30);
    expect(proxyUser.age).toBe(30);
  });
});
