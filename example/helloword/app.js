import { h } from '../../lib/mini-vue.esm.js';

window.self = null;
window.selfChild = null;

export const app = {
  render() {
    window.self = this;
    return h('div', {}, Child)
  },
  setup() {
    return {
      msg: 'mini-vue',
      name: 'chen'
    }
  }
}

const Child = {
  render() {
    window.selfChild = this;
    return h('span', {}, [
      h('p', {}, `hi, ${this.msg}`), h('p', {}, `hi, ${this.name}`)
    ])
  },
  setup() {
    return {
      msg: 'mini-vue',
      name: 'chen'
    }
  }
}