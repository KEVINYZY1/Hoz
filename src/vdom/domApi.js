import { isArray, isObject } from './is'

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode)
}

function nextSibling (node) {
  return node.nextSibling
}

function parentNode (node) {
  return node.parentNode
}

function setTextContent (node, text) {
  node.textContent = text
}

function setId (node, id) {
  node.id = id
}

function setClass (node, classN) {
  if (!node || !isArray(classN)) throw new Error(' function setClass gets Wrong parameters')
  let className = ''
  for (let i = 0; i < classN.length; i++) {
    if (i !== classN.length - 1) {
      className += classN[i] + ' '
    } else {
      className += classN[i]
    }
  }
  node.className = className
}

function setAttrs (node, attrs) {
  if (!node || !isObject(attrs)) throw new Error(' function setAttrs gets Wrong parameters')
  let key
  for (key in attrs) {
    if (key !== 'class') {
      node[key] = attrs[key]
    }
  }
}

function removeAttrs (node, attrs) {
  if (!node || !isObject(attrs)) throw new Error(' function removeAttrs gets Wrong parameters')
  for (let key in attrs) {
    if (key !== 'class') {
      node[key] = null
    }
  }
}

function appendChild (node, child) {
  node.appendChild(child)
}

function appendChildren (node, children) {
  if (!node || !isArray(children)) throw new Error(' function appendChildren gets Wrong parameters')
  for (let i in children) {
    let c = children[i].el
    node.appendChild(c)
  }
}

function removeChildren (node) {
  let ch = node.childNodes
  while (ch[0]) {
    node.removeChild(ch[0])
  }
}

function removeChild (parent, child) {
  return parent.removeChild(child)
}

function createComment (text) {
  return document.createComment(text)
}

function createElement (tag) {
  return document.createElement(tag)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

export default {
  insertBefore,
  nextSibling,
  parentNode,
  setTextContent,
  setId,
  setClass,
  setAttrs,
  appendChild,
  appendChildren,
  removeChildren,
  removeChild,
  createComment,
  createElement,
  createTextNode,
  removeAttrs
}
