import patch from '../vdom/patch'
import { deepCopy } from '../utils'

let oldVnodeTemp // 存放oldvnode
let vnodeTemp // 存放vnode

// 主题对象
function Dep () {
  this.subs = []
}

Dep.target = null

Dep.prototype.notify = function () {
  var subs = this.subs
  for (var i = 0, len = subs.length; i < len; i++) {
    subs[i].update()
  }
  patch(oldVnodeTemp, vnodeTemp)
  oldVnodeTemp = deepCopy(vnodeTemp) // 深拷贝一个vnodeTemp
}

Dep.prototype.addSub = function (sub) {
  this.subs.push(sub)
}

// 订阅者
function Watcher (vnode, keys, state, prop) {
  this.vnode = vnode
  this.keys = keys
  this.state = state
  this.prop = prop
  Dep.target = this // 暂存当前watcher
  this.value = this.get()
}

Watcher.prototype.get = function () {
  var value = this.state[this.prop]
  if (Dep.target) Dep.target = null
  return value
}

Watcher.prototype.update = function () {
  // 更新每个订阅者（vnode中对应的部分），不同的属性有不同的更改方式
  var newValue = this.get()
  if (this.value !== newValue) {
    let len = this.keys.length
    if (len === 1) {
      let key = this.keys[0]
      if (key === 'sel') {
        // 避免覆盖sel中其他属性值
        this.vnode[key] = this.vnode[key].replace(this.value, newValue)
      } else {
        this.vnode[key] = newValue
      }
    }
    if (len === 2) this.vnode[this.keys[0]][this.keys[1]] = newValue
    this.value = newValue
  }
}

Watcher.prototype.addDep = function (dep) {
  dep.addSub(this)
}

// 遍历操作vnode，将vnode上的{{}}模板替换成对应数据值，完成依赖收集
function compile (vnode, state, oldVnode) {
  if (!oldVnodeTemp && oldVnode) oldVnodeTemp = oldVnode // 保存旧的vnode
  if (!vnodeTemp) vnodeTemp = vnode // 保存vnode
  var reg = /\{\{.*\}\}/
  var matchPart
  for (let key in vnode) {
    if (key !== 'tagName' && key !== 'el' && key !== 'data' && key !== 'className') {
      if (reg.test(vnode[key])) {
        matchPart = vnode[key].match(reg)
        // 字符串处理，去掉{{}}
        matchPart[0] = matchPart[0].slice(2, -2)
        // 为vnode中对应的地方实例化一个watcher订阅者，并在对应data的get中添加到对应的主题对象Dep中
        new Watcher(vnode, [key], state, matchPart[0])
        let newStr = vnode[key].replace(reg, state[matchPart[0]])
        vnode[key] = newStr
        newStr = null
      }
    }
    if (key === 'className') {
      let arrClassName = vnode[key]
      for (let i in arrClassName) {
        if (reg.test(arrClassName[i])) {
          matchPart = arrClassName[i].match(reg)
          matchPart[0] = matchPart[0].slice(2, -2)
          new Watcher(vnode, [key, i], state, matchPart[0])
          let name = arrClassName[i].replace(reg, state[matchPart[0]])
          arrClassName[i] = name
        }
      }
    }
    if (key === 'data') {
      let objData = vnode[key]
      for (let attr in objData) {
        if (reg.test(objData[attr])) {
          console.log(attr, objData[attr])
          matchPart = objData[attr].match(reg)
          matchPart[0] = matchPart[0].slice(2, -2)
          new Watcher(vnode, [key, attr], state, matchPart[0])
          let data = objData[attr].replace(reg, state[matchPart[0]])
          objData[attr] = data
        }
      }
    }
    if (key === 'children') {
      let chs = vnode[key]
      if (chs) {
        for (let i in chs) {
          // 对子vnode进行递归操作
          let ch = chs[i]
          compile(ch, state)
        }
      }
    }
  }
}

export {
  compile,
  Dep
}
