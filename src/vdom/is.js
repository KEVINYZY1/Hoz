function isElement (node) {
  return node.nodeType === 1
}

function isText (node) {
  return node.nodeType === 3
}

function isComment (node) {
  return node.nodeType === 8
}

function isArray (arr) {
  return arr.constructor === Array
}

function isObject (obj) {
  return obj.constructor === Object
}

export {
  isElement,
  isComment,
  isText,
  isArray,
  isObject
}
