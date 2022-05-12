import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
  return {
    mounted(container) {
      const vnode = createVNode(rootComponent);
      render(vnode, container);
    },
  };
}
