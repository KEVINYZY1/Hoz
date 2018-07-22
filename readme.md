> 通过造轮子，理解原理。

## 特点
- 响应式的数据绑定
- 借鉴flux思想，引入状态管理
- 引入virtual dom，diff 算法，提高性能

#### 声明式语法
```html
  <div id = "app">
      <div>
          <img src="{{moveImage}}" />
          <p>{{moveName}}</p>
      </div>
  </div>
```
```js
var hoz = new Hoz('app', state, changeStore)

var state = {
  moveName: '',
  moveImage: ''
}
```
通过简洁的模板语法声明式的将数据渲染进DOM系统。
且所有东西都是响应式的。

#### 借鉴flux思想，引入状态管理
在状态管理方面借鉴flux的思想，实现了单向数据流的管理。
主要定义了state，action，changeStore，dispatch4个概念。
#### state
存放数据
```js
var state = {
  moveName: '',
  moveImage: ''
}
```
#### changeStore
存放着对数据的所有操作
```js
function changeStore (state, action) {
  switch (action.type) {
    case 'SET_NAME': {
      state.moveName = action.data
      break
    }
    case 'SET_IMAGE': {
      state.moveImage = action.data
      break
    }
  }
}
```
接收action，执行对应的方法，修改state中的数据。它直接操作当前的state，因为state中的数据已经通过Object.defineProperty方法进行了跟踪，这个后面再将。
#### action和dispatch
当想要对数据进行修改的时候，我们必须通过提交action的方式，在changeStore中去修改state
```js
hoz.store.dispatch({
  type: 'SET_NAME',
  data: '后来的我们'
})
```

这个就是hoz的状态管理策略
```js
 view -> dispatch -> action -> changeStore -> state -> view
```
![state](https://github.com/HolyZheng/Hoz/blob/master/images/state.png)

#### 好处
随着应用的日益复杂，数据量的增大，如果不对数据进行相应的管理，管理不断变化的状态，是非常困难的。状态在什么时候，由于什么原因，发生了怎样的变化都难以观察。
1. 这意味着应用中所有的数据都遵循相同的生命周期，这样可以让应用变得更加可预测且容易理解。
2. 我们可以从 changeStore 中看到state能够发生的所有变化
3. 对state修改的唯一方式就是向changeStore提交action，所以数据的每一次变化都会从一个地方流过，方便我们的debug等操作。

#### 引入virtual dom 和diff算法
总所周知，由于dom元素的庞大，以及dom操作容易引起页面重排的原因，直接操作dom性能是非常非常差的。
所以hoz引入了virtual dom算法，用原生的JavaScript对象去映射dom对象，因为原生JavaScript对象的操作更快更简单。
如何映射呢？比如
```js
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
```
只是一个JavaScript对象，代表一个dom元素。

我根据hoz构造函数中传进来的 id 所指向的元素作为根元素建立一个虚拟dom树，当数据改变的时候，不直接操作dom，而是在虚拟dom树上进行操作修改。然后通过diff算法对比新旧虚拟dom树，对真实dom进行最小单位的修改。

#### 数据响应式原理
hoz式如何做到数据的响应式的呢？这里主要通过借助Object.defineProperty方法实现了一个发布/订阅模式，通过Object.defineProperty修改state中数据的getter和setter属性，在首次渲染的时候，在getter中将对应的订阅者添加到一个主题对象中去，当数据改变的时候在setter中调用对应数据的主题对象的notify方法发布消息，通知每个订阅者更新。
```js
state -> data -> publisher      一对多的关系
                     |
                    Dep
                    /|\

view -> {{data}} -> subscriber
```
#### hoz的整个运作图
![state](https://github.com/HolyZheng/Hoz/blob/master/images/hoz.png)
