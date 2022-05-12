import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  it("happy path", () => {
    let reactiveObj = reactive({ foo: 10 });
    let newObj;
    effect(() => {
      newObj = reactiveObj.foo + 1;
    });
    expect(newObj).toBe(11);

    /* update */
    reactiveObj.foo++;
    expect(newObj).toBe(12);
  });
  /* runner */
  it("should effect return runner function", () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    });
    expect(foo).toBe(11);
    let r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");
  });
  it("scheduler", () => {
    /* 
      scheduler 简单用途： 
      初始化的时候调用 effect fn
      当更新数据的时候则会调用 scheduler 函数，不会调用 fn 函数
    */
    let dummy;
    let run;
    /* 定义一个函数 */
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        scheduler,
      }
    );
    // 第一次不执行
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });
  /* 好神奇的设计、是想做成可中断么？ */
  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });

    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);

    // 只 get
    // obj.prop = 3;

    /* 
      fix：解决在 stop 情况下， get、set 都有时，不重新收集依赖
      当使用 obj.prop++ 则会失败，因为 obj.prop => obj.prop = obj.prop + 1 会执行 get、set。
      get 会重新收集依赖，所以 stop 失败 
    */
    obj.prop++;
    expect(dummy).toBe(2);

    // stop 只执行一次
    runner();
    expect(dummy).toBe(3);
  });

  it("onStop", () => {
    const obj = reactive({ foo: 1 });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        onStop,
      }
    );
    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
