import {Dep} from '../core/compile'

function createStore (myState, changeState) {
  if (!myState || !myState.constructor || myState.constructor !== Object) {
    throw new Error('plase pass a State object to initialize you store in argments[0]')
  }
  if (!changeState || typeof changeState !== 'function') {
    throw new Error('plase pass a changeStore function to initialize you store argments[1]')
  }

  let state = null
  let isDispatch = false // 判断是否通过action来修改state
  const getState = () => state
  const dispatch = (action) => {
    isDispatch = true
    changeState(state, action)
  }
  const defineReactive = function (obj, key, val) {
    var dep = new Dep()
    Object.defineProperty(obj, key, {
      get: function () {
        if (Dep.target) {
          Dep.target.addDep(dep)
        }
        return val
      },
      set: function (newVal) {
        if (!isDispatch) {
          throw new Error('you must change state by sending action')
        }
        val = newVal
        isDispatch = false
        dep.notify()
      }
    })
  }
  const observer = state => {
    // 遍历state，更改其中的getter和setter，进行数据劫持
    for (let key in state) {
      // state[key] 发布者
      defineReactive(state, key, state[key])
    }
  }
  const init = (function (myState) {
    // 单例模式。只能当state还没有初始化的时候可以调用init初始化
    if (window && !window.$hasState) {
      window.$hasState = true
    } else {
      throw new Error('you can init only one state !')
    }
    if (!state) {
      state = myState
      observer(state)
    }
  })(myState)

  const addState = function (key, val) {
    state[key] = val
    observer(state)
  }

  return {state, init, getState, dispatch, addState}
}

export default createStore
