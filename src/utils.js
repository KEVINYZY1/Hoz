// 深拷贝
function deepCopy (obj) {
  var newObj = null
  if (typeof obj !== 'object' || obj === null) {
    return
  } else {
    newObj = obj.constructor === Array ? [] : {}
    for (let i in obj) {
      if (i !== 'el') {
        newObj[i] = typeof obj[i] === 'object' ? deepCopy(obj[i]) : obj[i]
      } else {
        // el属性为浅拷贝
        newObj[i] = obj[i]
      }
    }
  }
  return newObj
}

export {
  deepCopy
}
