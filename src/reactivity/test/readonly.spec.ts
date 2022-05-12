import { readonly, isReadonly } from "../reactive";

describe("readonly", () => {
  it("happy path", () => {
    // on set
    const obj = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(obj);
    expect(wrapped).not.toBe(obj);
    expect(wrapped.foo).toBe(1);

    // isReadOnly
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(obj)).toBe(false);
  });
  it("depth readonly", () => {
    const obj = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(obj);
    expect(isReadonly(wrapped)).toBe(true);
    // 值类型不属于只读
    // expect(isReadonly(wrapped.foo)).toBe(true);
  });
});
