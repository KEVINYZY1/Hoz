import toVnode from '../vdom/toVnode'
import createStore from '../storeux/createStore'
import { compile } from './compile'
import { deepCopy } from '../utils'
import patch from '../vdom/patch'

window.Hoz = function (el, state, changeState) {
  this.dom = document.getElementById(el)
  this.oldVnode = toVnode(this.dom) // 用于与修改后的vnode比较
  this.vnode = deepCopy(this.oldVnode)
  this.store = createStore(state, changeState)
  compile(this.vnode, this.store.state, this.oldVnode)
  patch(this.oldVnode, this.vnode)
}
