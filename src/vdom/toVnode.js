import VNode from './vnode'
import * as utils from './is'

function toVnode (node, utilsTool) {
  const api = (utilsTool === undefined ? utils : utilsTool)
  let text
  if (!node) {
    throw new Error('Please make sure you have pass the argument "node" in to function toVnode')
  }
  if (api.isElement(node)) {
    const id = node.id ? node.id : ''
    const cn = node.getAttribute('class')
    const ca = cn ? cn.split(' ') : null // classArray
    const c = cn ? '.' + cn.split(' ').join('.') : '' // .classA.classB
    const sel = node.tagName.toLowerCase() + '#' + id + c
    const attrs = {}
    const elmAttrs = node.attributes
    const elmChildren = node.childNodes
    const children = elmChildren.length ? [] : null
    const tag = node.tagName
    let i, n
    for (i = 0, n = elmAttrs.length; i < n; i++) {
      if (elmAttrs[i].nodeName !== 'class' && elmAttrs[i].nodeName !== 'id') {
        // id 和 class例外处理
        attrs[elmAttrs[i].nodeName] = elmAttrs[i].nodeValue
      }
    }
    const key = attrs.key ? attrs.key : undefined
    for (i = 0, n = elmChildren.length; i < n; i++) {
      children.push(toVnode(elmChildren[i], api))
    }
    return new VNode(sel, tag, id, ca, node, children, attrs, undefined, key)
  } else if (api.isText(node)) {
    text = node.textContent
    return new VNode(undefined, undefined, undefined, undefined, node, undefined, undefined, text, undefined)
  } else if (api.isComment(node)) {
    text = node.textContent
    return new VNode('commont', undefined, undefined, undefined, node, undefined, undefined, text, undefined)
  } else {
    return new VNode('', undefined, undefined, undefined, node, undefined, undefined, undefined, undefined)
  }
}

export default toVnode
