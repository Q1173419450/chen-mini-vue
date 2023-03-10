import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";
import { createVNode } from "./vnode";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode: any, container: any) {
  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container);
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  let el = vnode.el = document.createElement(vnode.type);
  let { children, props } = vnode;
  if (typeof children === 'string') { // text
    el.textContent = children;
  } else if (Array.isArray(children)) { // array
    mountChildren(vnode, el);
  } else if (isObject(children)) {  // object
    let childNode = createVNode(vnode.children);
    patch(childNode, el);
  }
  for (const prop in props) {
    const value = props[prop];
    el.setAttribute(prop, value);
  }
  container.append(el);
}

function mountChildren(vnode, container) {
  vnode.children.forEach((ele) => {
    patch(ele, container);
  });
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container) {
  // 组件实例
  const instance = createComponentInstance(vnode);
  // 配置组件实例
  setupComponent(instance);
  // 执行 render
  setupRenderEffect(instance, vnode, container);
}

function setupRenderEffect(instance: any, vnode, container) {
  const { proxy } = instance;
  // 绑定 this 数据
  let subTree = instance.render.call(proxy);
  patch(subTree, container);
  vnode.el = subTree.el;
}
