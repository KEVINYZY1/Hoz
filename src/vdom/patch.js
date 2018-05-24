import api from './domApi'
import { isArray } from './is'

function sameVnode (oldVnode, vnode) {
  return vnode.key === oldVnode.key && vnode.tagName === oldVnode.tagName
  // 这里做了个修改，原本vnode.sel === oldVnode.sel, 因为class和id可通过模板语法更改
}

function createKeyToOldIndex (children, beginIdx, endIdx) {
  let i
  let map = {}
  let key
  for (i = beginIdx; i <= endIdx; i++) {
    if (children[i] != null) {
      key = children[i].key
      if (key !== null) {
        map[key] = i
      }
    }
  }
  return map
}

// 更新elm的className, id和其他data中的属性
function updateElm (elm, vnode) {
  vnode.className && vnode.className.length > 0 && api.setClass(elm, vnode.className)
  vnode.data && api.setAttrs(elm, vnode.data)
  vnode.id && api.setId(elm, vnode.id)
}

// destroy elmAttrs
function deleteElmAttrs (elm, vnode) {
  if (vnode.className && vnode.className.length > 0) elm.className = []
  vnode.data && api.removeAttrs(elm, vnode.data)
  if (vnode.id) elm.id = ''
}

// 为vnode tree 创建 dom tree
function createElm (vnode) {
  if (vnode.sel === 'commont') {
    if (vnode.text == null) {
      vnode.text = ''
    }
    vnode.el = api.createComment(vnode.text)
  } else if (!vnode.sel && vnode.text) {
    vnode.el = api.createTextNode(vnode.text)
  } else if (vnode.tagName) {
    vnode.el = api.createElement(vnode.tagName)
    updateElm(vnode.el, vnode)
    let children = vnode.children ? vnode.children : []
    if (isArray(children)) {
      children.forEach(ch => {
        ch && api.appendChild(vnode.el, createElm(ch))
      })
    }
  }
  return vnode.el
}

function addVnodes (parentElm, before, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (ch != null) {
      api.insertBefore(parentElm, createElm(ch), before)
    }
  }
}

function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
  // 有一个优化点，remove节点时，应先移除相关属性和绑定的事件
  for (; startIdx <= endIdx; ++startIdx) {
    var ch = vnodes[startIdx]
    if (ch != null) {
      deleteElmAttrs(ch.el, ch)
      api.removeChild(parentElm, ch.el)
    }
  }
}

function updateChildren (parentElm, oldCh, newCh) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newEndIdx = newCh.length - 1
  let oldStartVnode = oldCh[0]
  let newStartVnode = newCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx
  let idxInOld
  let emlToMove
  let before
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // oldStartIdx 与 oldEndIdx 与 newStartIdx 与 newEndIdx 之间四中比较
    // 简单的判断子节点的移位
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx]
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode)
      api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode)
      api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIndex(oldCh, oldStartIdx, oldEndIdx)
      }
      idxInOld = oldKeyToIdx[newStartVnode.key]
      // idx 不存在，说明该节点是新增的，原来没有的，故创建一个新节点，并插入
      if (!idxInOld) {
        api.insertBefore(parentElm, createElm(newStartVnode), oldStartVnode.el)
        newStartVnode = newCh[++newStartIdx]
      } else {
        emlToMove = oldCh[idxInOld]
        // sel 不同的话，证明也是一个原来没有的节点，所以创建并插入
        if (emlToMove.sel !== newStartVnode.sel) {
          api.insertBefore(parentElm, createElm(newStartVnode), oldStartVnode.el)
        } else {
          patchVnode(emlToMove, newStartVnode)
          oldCh[idxInOld] = null
          api.insertBefore(parentElm, emlToMove.el, oldStartVnode.el)
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
  }
  // 这是oldVnode已经遍历完，vnode还没有，说明vnode比oldVnode节点多，所以将多出的节点创建并插入
  if (oldStartIdx > oldEndIdx) {
    before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
    addVnodes(parentElm, before, newCh, newStartIdx, oldEndIdx)
  } else {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}

function patchVnode (oldVnode, vnode) {
  const element = vnode.el = oldVnode.el
  let oldCh = oldVnode.children
  let ch = vnode.children
  // 如果相同，不需要比较
  if (oldVnode === vnode) {
    console.log('oldVnode === vnode')
    return
  }
  if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
    api.setTextContent(element, vnode.text)
  } else {
    // 更新element的className, id, 和其他属性
    updateElm(element, vnode)
    if (oldCh && ch && oldCh !== ch) {
      updateChildren(element, oldCh, ch)
    } else if (ch) {
      // 新vnode有子节点，oldvnode没有子节点，给element添加子节点
      addVnodes(element, null, ch, 0, ch.length - 1)
    } else if (oldCh) {
      // 新vnode没有子节点，oldvnode有子节点，给element删除子节点
      removeVnodes(element, oldCh, 0, oldCh.length - 1)
    }
  }
}

/**
 * 比较新老节点，相同则进行patchVnode，不同的话在真实dom上
 * 用新的节点，取代旧的节点。
 */

export default function patch (oldVnode, vnode) {
  if (sameVnode(oldVnode, vnode)) {
    patchVnode(oldVnode, vnode)
  } else {
    const oldElement = oldVnode.el
    let parentElement = api.parentNode(oldElement)
    createElm(vnode)
    if (parentElement !== null) {
      api.insertBefore(parentElement, vnode.el, api.nextSibling(oldElement))
      api.removeChild(parentElement, oldVnode.el)
    }
  }
  return vnode
}
