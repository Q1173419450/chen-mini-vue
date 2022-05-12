import { computed } from "../computed";
import { reactive } from "../reactive";

describe("computed", () => {
  /* 
    ref
    缓存
  */
  it("happy path", () => {
    let obj = reactive({
      a: 1,
    });
    const computedObj = computed(() => {
      return obj.a;
    });

    expect(computedObj.value).toBe(1);
  });

  it("should computed lazy", () => {
    let obj = reactive({
      a: 1,
    });
    const fn = jest.fn(() => {
      return obj.a;
    });
    const computedObj = computed(fn);

    // lazy
    expect(fn).not.toHaveBeenCalled();

    expect(computedObj.value).toBe(1);
    expect(fn).toBeCalledTimes(1);

    // 缓存
    computedObj.value;
    expect(fn).toBeCalledTimes(1);

    obj.a = 2; /* trigger => effect => getter */
    expect(fn).toBeCalledTimes(1);

    expect(computedObj.value).toBe(2);
    expect(fn).toBeCalledTimes(2);
  });
});
