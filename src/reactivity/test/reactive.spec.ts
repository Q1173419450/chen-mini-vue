import { isReactive, reactive } from "../reactive";

describe("reactive", () => {
  it("happy path", () => {
    let obj = { a: 10 };
    let newObj = reactive(obj);
    expect(newObj).not.toBe(obj);
    expect(newObj.a).toBe(10);

    // isReactive
    expect(isReactive(newObj)).toBe(true);
    expect(isReactive(obj)).toBe(false);
  });
  it("depth reactive", () => {
    let obj = {
      f: 1,
      a: {
        b: "bbb",
      },
      c: [{ d: "ddd" }],
    };
    let newObj = reactive(obj);
    expect(isReactive(newObj)).toBe(true);
    expect(isReactive(newObj.a)).toBe(true);
    expect(isReactive(newObj.c)).toBe(true);
    expect(newObj.f).toBe(1);
  });
});
