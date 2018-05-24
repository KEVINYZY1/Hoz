class VNode {
  constructor (sel, tagName, id, className, el, children, data, text, key) {
    this.tagName = tagName // DIV
    this.sel = sel // div#id.class
    this.id = id // id
    this.className = className // []
    this.children = children // []
    this.el = el // node
    this.data = data // {}
    this.key = key
    this.text = text
  }
}

export default VNode
