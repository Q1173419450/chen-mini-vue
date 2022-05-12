import { isReadonly, shallowReadonly } from "../reactive";

describe("shallow", () => {
  it("happy path", () => {
    let obj = {
      a: { c: 1 },
    };
    let newObj = shallowReadonly(obj);
    expect(isReadonly(newObj)).toBe(true);
    expect(isReadonly(newObj.a)).toBe(false);
  });
});
