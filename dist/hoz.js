!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="./src/core/index.js")}({"./src/core/compile.js":
/*!*****************************!*\
  !*** ./src/core/compile.js ***!
  \*****************************/
/*! no static exports found */function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Dep=t.compile=void 0;var o,r=n(/*! ../vdom/patch */"./src/vdom/patch.js"),i=(o=r)&&o.__esModule?o:{default:o},s=n(/*! ../utils */"./src/utils.js");var a=void 0,l=void 0;function u(){this.subs=[]}function d(e,t,n,o){this.vnode=e,this.keys=t,this.state=n,this.prop=o,u.target=this,this.value=this.get()}u.target=null,u.prototype.notify=function(){for(var e=this.subs,t=0,n=e.length;t<n;t++)e[t].update();(0,i.default)(a,l),a=(0,s.deepCopy)(l)},u.prototype.addSub=function(e){this.subs.push(e)},d.prototype.get=function(){var e=this.state[this.prop];return u.target&&(u.target=null),e},d.prototype.update=function(){var e=this.get();if(this.value!==e){var t=this.keys.length;if(1===t){var n=this.keys[0];this.vnode[n]="sel"===n?this.vnode[n].replace(this.value,e):e}2===t&&(this.vnode[this.keys[0]][this.keys[1]]=e),this.value=e}},d.prototype.addDep=function(e){e.addSub(this)},t.compile=function e(t,n,o){!a&&o&&(a=o),l||(l=t);var r,i=/\{\{.*\}\}/;for(var s in t){if("tagName"!==s&&"el"!==s&&"data"!==s&&"className"!==s&&i.test(t[s])){(r=t[s].match(i))[0]=r[0].slice(2,-2),new d(t,[s],n,r[0]);var u=t[s].replace(i,n[r[0]]);t[s]=u,u=null}if("className"===s){var c=t[s];for(var f in c)if(i.test(c[f])){(r=c[f].match(i))[0]=r[0].slice(2,-2),new d(t,[s,f],n,r[0]);var v=c[f].replace(i,n[r[0]]);c[f]=v}}if("data"===s){var p=t[s];for(var h in p)if(i.test(p[h])){console.log(h,p[h]),(r=p[h].match(i))[0]=r[0].slice(2,-2),new d(t,[s,h],n,r[0]);var m=p[h].replace(i,n[r[0]]);p[h]=m}}if("children"===s){var y=t[s];if(y)for(var g in y)e(y[g],n)}}},t.Dep=u},"./src/core/index.js":
/*!***************************!*\
  !*** ./src/core/index.js ***!
  \***************************/
/*! no static exports found */function(e,t,n){"use strict";var o=l(n(/*! ../vdom/toVnode */"./src/vdom/toVnode.js")),r=l(n(/*! ../storeux/createStore */"./src/storeux/createStore.js")),i=n(/*! ./compile */"./src/core/compile.js"),s=n(/*! ../utils */"./src/utils.js"),a=l(n(/*! ../vdom/patch */"./src/vdom/patch.js"));function l(e){return e&&e.__esModule?e:{default:e}}window.Hoz=function(e,t,n){this.dom=document.getElementById(e),this.oldVnode=(0,o.default)(this.dom),this.vnode=(0,s.deepCopy)(this.oldVnode),this.store=(0,r.default)(t,n),(0,i.compile)(this.vnode,this.store.state,this.oldVnode),(0,a.default)(this.oldVnode,this.vnode)}},"./src/storeux/createStore.js":
/*!************************************!*\
  !*** ./src/storeux/createStore.js ***!
  \************************************/
/*! no static exports found */function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(/*! ../core/compile */"./src/core/compile.js");t.default=function(e,t){if(!e||!e.constructor||e.constructor!==Object)throw new Error("plase pass a State object to initialize you store in argments[0]");if(!t||"function"!=typeof t)throw new Error("plase pass a changeStore function to initialize you store argments[1]");var n=null,r=!1,i=function(e,t,n){var i=new o.Dep;Object.defineProperty(e,t,{get:function(){return o.Dep.target&&o.Dep.target.addDep(i),n},set:function(e){if(!r)throw new Error("you must change state by sending action");n=e,r=!1,i.notify()}})},s=function(e){for(var t in e)i(e,t,e[t])},a=function(e){if(!window||window.$hasState)throw new Error("you can init only one state !");window.$hasState=!0,n||s(n=e)}(e);return{state:n,init:a,getState:function(){return n},dispatch:function(e){r=!0,t(n,e)},addState:function(e,t){n[e]=t,s(n)}}}},"./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! no static exports found */function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.deepCopy=function e(t){var n=null;if("object"===(void 0===t?"undefined":o(t))&&null!==t){for(var r in n=t.constructor===Array?[]:{},t)n[r]="el"!==r&&"object"===o(t[r])?e(t[r]):t[r];return n}}},"./src/vdom/domApi.js":
/*!****************************!*\
  !*** ./src/vdom/domApi.js ***!
  \****************************/
/*! no static exports found */function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(/*! ./is */"./src/vdom/is.js");t.default={insertBefore:function(e,t,n){e.insertBefore(t,n)},nextSibling:function(e){return e.nextSibling},parentNode:function(e){return e.parentNode},setTextContent:function(e,t){e.textContent=t},setId:function(e,t){e.id=t},setClass:function(e,t){if(!e||!(0,o.isArray)(t))throw new Error(" function setClass gets Wrong parameters");for(var n="",r=0;r<t.length;r++)r!==t.length-1?n+=t[r]+" ":n+=t[r];e.className=n},setAttrs:function(e,t){if(!e||!(0,o.isObject)(t))throw new Error(" function setAttrs gets Wrong parameters");var n=void 0;for(n in t)"class"!==n&&(e[n]=t[n])},appendChild:function(e,t){e.appendChild(t)},appendChildren:function(e,t){if(!e||!(0,o.isArray)(t))throw new Error(" function appendChildren gets Wrong parameters");for(var n in t){var r=t[n].el;e.appendChild(r)}},removeChildren:function(e){for(var t=e.childNodes;t[0];)e.removeChild(t[0])},removeChild:function(e,t){return e.removeChild(t)},createComment:function(e){return document.createComment(e)},createElement:function(e){return document.createElement(e)},createTextNode:function(e){return document.createTextNode(e)},removeAttrs:function(e,t){if(!e||!(0,o.isObject)(t))throw new Error(" function removeAttrs gets Wrong parameters");for(var n in t)"class"!==n&&(e[n]=null)}}},"./src/vdom/is.js":
/*!************************!*\
  !*** ./src/vdom/is.js ***!
  \************************/
/*! no static exports found */function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isElement=function(e){return 1===e.nodeType},t.isComment=function(e){return 8===e.nodeType},t.isText=function(e){return 3===e.nodeType},t.isArray=function(e){return e.constructor===Array},t.isObject=function(e){return e.constructor===Object}},"./src/vdom/patch.js":
/*!***************************!*\
  !*** ./src/vdom/patch.js ***!
  \***************************/
/*! no static exports found */function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){if(a(e,t))v(e,t);else{var n=e.el,o=i.default.parentNode(n);d(t),null!==o&&(i.default.insertBefore(o,t.el,i.default.nextSibling(n)),i.default.removeChild(o,e.el))}return t};var o,r=n(/*! ./domApi */"./src/vdom/domApi.js"),i=(o=r)&&o.__esModule?o:{default:o},s=n(/*! ./is */"./src/vdom/is.js");function a(e,t){return t.key===e.key&&t.tagName===e.tagName}function l(e,t,n){var o=void 0,r={},i=void 0;for(o=t;o<=n;o++)null!=e[o]&&null!==(i=e[o].key)&&(r[i]=o);return r}function u(e,t){t.className&&t.className.length>0&&i.default.setClass(e,t.className),t.data&&i.default.setAttrs(e,t.data),t.id&&i.default.setId(e,t.id)}function d(e){if("commont"===e.sel)null==e.text&&(e.text=""),e.el=i.default.createComment(e.text);else if(!e.sel&&e.text)e.el=i.default.createTextNode(e.text);else if(e.tagName){e.el=i.default.createElement(e.tagName),u(e.el,e);var t=e.children?e.children:[];(0,s.isArray)(t)&&t.forEach(function(t){t&&i.default.appendChild(e.el,d(t))})}return e.el}function c(e,t,n,o,r){for(;o<=r;++o){var s=n[o];null!=s&&i.default.insertBefore(e,d(s),t)}}function f(e,t,n,o){for(;n<=o;++n){var r=t[n];null!=r&&(s=r.el,(a=r).className&&a.className.length>0&&(s.className=[]),a.data&&i.default.removeAttrs(s,a.data),a.id&&(s.id=""),i.default.removeChild(e,r.el))}var s,a}function v(e,t){var n=t.el=e.el,o=e.children,r=t.children;e!==t?null!==e.text&&null!==t.text&&e.text!==t.text?i.default.setTextContent(n,t.text):(u(n,t),o&&r&&o!==r?function(e,t,n){for(var o=0,r=0,s=t.length-1,u=n.length-1,p=t[0],h=n[0],m=t[s],y=n[u],g=void 0,j=void 0,b=void 0;o<=s&&r<=u;)null==p?p=t[++o]:null==m?m=t[--s]:null==h?h=n[++r]:null==y?y=n[--u]:a(p,h)?(v(p,h),p=t[++o],h=n[++r]):a(m,y)?(v(m,y),m=t[--s],y=n[--u]):a(p,y)?(v(p,y),i.default.insertBefore(e,p.el,i.default.nextSibling(m.el)),p=t[++o],y=n[--u]):a(m,h)?(v(m,h),i.default.insertBefore(e,m.el,p.el),m=t[--s],h=n[++r]):(void 0===g&&(g=l(t,o,s)),(j=g[h.key])?((b=t[j]).sel!==h.sel?i.default.insertBefore(e,d(h),p.el):(v(b,h),t[j]=null,i.default.insertBefore(e,b.el,p.el)),h=n[++r]):(i.default.insertBefore(e,d(h),p.el),h=n[++r]));o>s?c(e,null==n[u+1]?null:n[u+1].el,n,r,s):f(e,t,o,s)}(n,o,r):r?c(n,null,r,0,r.length-1):o&&f(n,o,0,o.length-1)):console.log("oldVnode === vnode")}},"./src/vdom/toVnode.js":
/*!*****************************!*\
  !*** ./src/vdom/toVnode.js ***!
  \*****************************/
/*! no static exports found */function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r=n(/*! ./vnode */"./src/vdom/vnode.js"),i=(o=r)&&o.__esModule?o:{default:o},s=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(/*! ./is */"./src/vdom/is.js"));t.default=function e(t,n){var o=void 0===n?s:n,r=void 0;if(!t)throw new Error('Please make sure you have pass the argument "node" in to function toVnode');if(o.isElement(t)){var a=t.id?t.id:"",l=t.getAttribute("class"),u=l?l.split(" "):null,d=l?"."+l.split(" ").join("."):"",c=t.tagName.toLowerCase()+"#"+a+d,f={},v=t.attributes,p=t.childNodes,h=p.length?[]:null,m=t.tagName,y=void 0,g=void 0;for(y=0,g=v.length;y<g;y++)"class"!==v[y].nodeName&&"id"!==v[y].nodeName&&(f[v[y].nodeName]=v[y].nodeValue);var j=f.key?f.key:void 0;for(y=0,g=p.length;y<g;y++)h.push(e(p[y],o));return new i.default(c,m,a,u,t,h,f,void 0,j)}return o.isText(t)?(r=t.textContent,new i.default(void 0,void 0,void 0,void 0,t,void 0,void 0,r,void 0)):o.isComment(t)?(r=t.textContent,new i.default("commont",void 0,void 0,void 0,t,void 0,void 0,r,void 0)):new i.default("",void 0,void 0,void 0,t,void 0,void 0,void 0,void 0)}},"./src/vdom/vnode.js":
/*!***************************!*\
  !*** ./src/vdom/vnode.js ***!
  \***************************/
/*! no static exports found */function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=function e(t,n,o,r,i,s,a,l,u){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.tagName=n,this.sel=t,this.id=o,this.className=r,this.children=s,this.el=i,this.data=a,this.key=u,this.text=l}}});