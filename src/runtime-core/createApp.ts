import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
  return {
    mount(container) {
      let app = container;
      if (typeof container == "string") {
        app = document.querySelector(container);
      }
      const vnode = createVNode(rootComponent);
      render(vnode, app);
    },
  };
}
