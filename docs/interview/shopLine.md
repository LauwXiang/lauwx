2020.06.14 现场笔试+面试
------------------

### 笔试

1.输出打印顺序

```js
console.log('script start')

async function async1(){
  await async2()
  console.log('async1 end')
}
async function async2(){
  console.log('async2 end')
}
async1()

setTimeout(function(){
  console.log('setTimeout')
},0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
}).then(function(){
  console.log('promise1')
}).then(function(){
  console.log('promise2')
})

console.log('script end')
```

解析：​`详情可见前端面试之道-7 Event Loop`

script start =\> async2 end =\> Promise =\> script end =\> async1 end =\> promise1 =\> promise2 =\> setTimeout 

1.setTimeout为宏任务 ，promise为微任务，当执行栈为空时，Event Loop会优先执行microtask队列中的任务，再执行macrotask中的任务；

2.await为generator加promise的语法糖，await为异步操作，后来的表达式不返回Promise的话，就会包装成Promise.resolve(返回值)，然后去执行函数外的同步代码，所以当上述代码执行完第一次Event Loop后会回到await的位置执行Promise的resolve函数，又会把resolve丢到microtask队列中，把`new Promise`​中的then回调函数执行完后，又会回到await处处理返回值，可以看成Promise.resolve(返回值).then()，然后await后的全部代码被包裹进then的回调。

`可以将2中的async的两个函数改造成如下：`

```js
new Promise((resolve,reject) => {
  console.log('async2 end')
  resolve(Promise.resolve())
}).then(() => {
  console.log('async1 end')
})
```

---

2.打印出什么

```js
function bar(){
  console.log(test)
}
function foo(){
  var test = 3
  bar()
}
var test = 1 
foo()
```

解析：函数的环境变量是在声明时确定而非执行时确定，故foo的test并没有被引用。

---

3.写一个js发布订阅的模式，具备有发布消息、订阅消息和取消订阅的功能

`发布-订阅是一种消息范式，消息的发送者（称为发布者）不会将消息直接发送给特定的接收者（称为订阅者）。而是将发布的消息分为不同的类别，无需了解哪些订阅者（如果有的话）可能存在。同样的，订阅者可以表达对一个或多个类别的兴趣，只接收感兴趣的消息，无需了解哪些发布者（如果有的话）存在。`

```

```

`观察者模式，定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新。`

`也就是说，发布/订阅模式和观察者最大的差别就在于消息是否通过一个中间类进行转发。`

```

```

发布/订阅者模式优点：

* 相较于观察者模式，发布/订阅发布者和订阅者的耦合性更低
* 通过并行操作，消息缓存，基于树或基于网络的路由等技术，发布/订阅提供了比传统的客户端–服务器更好的可扩展性

缺点：

* 当中间类采用定时发布通知时，使用发布订阅无法确定所有订阅者是否都成功收到通知
* 当负载激增，请求订阅的订阅者数量增加，每个订阅者接收到通知的速度将会变慢

```js
class PubSub {
  construct(){
    this._events = {}
  }
  
  //注册事件
  on(eventName,callback){
    if(this._events[eventName]){
      this._events[eventName].push(callback)
    }else{
      this._events = [callback]
    }
  }
  
  //发布消息
  publish(eventName){
    if(this._events[eventName]){
      this._events[eventName].forEach(func => {
        func()
      })
    }
  }
  
  //订阅消息
  addEventListen(eventName,callback){
    this.on(eventName,callback)
  }
  
  //取消订阅
  removeEventListen(eventName){
    this._evnets[eventName].length = 0
  }
  
}
```

---

---

### 面试

1.http缓存

**缓存位置**

浏览器缓存位置主要有：

1. Service Worker
2. Memory Cache
3. Disk Cache
4. Push Cache
5. 网络请求

其中Push Cache为HTTP/2的内容，当上面3个缓存都没有命中的时候，才会被使用，缓存时间较为短暂，只会在会话（Session）中存在，一旦结束就会被释放。

Push Cache国内资料比较少，且兼容性不太好，很少被使用。

网络请求是指，上述4个缓存都没有命中时，只能发起请求获取资源。为了性能考虑，大部分接口都会有缓存策略。

**缓存策略**

通常浏览器缓存策略分为两种：强缓存和协商缓存，并且缓存策略都是通过设置 HTTP Header 来实现的。

1.强缓存

强缓存可以通过设置HTTP Header实现：`Expires`和`Cache-Control`。强缓存表示缓存期间不需要请求，`state code`为200。

* Expires为HTTP/1的产物，表示资源会在Expires表示的时间后过期，需要重新请求资源，且受限于本地时间
* Cache-Control出现于HTTP/1.1，优先级高于Expires，其值有public,private,max-age=30,s-maxage=30,no-store,no-cache,max-state=30,min-fresh=30

2.协商缓存

如果缓存过期了，就需要发起请求验证资源是否有更新。协商缓存可以通过设置两种 HTTP Header 实现：`Last-Modified` 和 `ETag` 。

当浏览器发起请求验证资源时，如果资源没有做改变，那么服务端就会返回 304 状态码，并且更新浏览器缓存有效期。

* Last-Modified和If-Modified-Since Last-Modifed表示本地文件最后修改日期，If-Modified-Since会将Last-Modified的值发送给服务器，询问是否有更新，有更新的话发送新的资源，否则返回304状态码
* ETag和If-None-Match Etag类似于指纹，If-None-Match会将当前Etag发送给服务器，询问该资源的Etag是否有变动，有变动的话就将新的资源发送回来

因为Last-Modifed存在以下弊端：

* 如果本地打开缓存文件，即使没有对文件进行修改，但还是会造成 `Last-Modified` 被修改，服务端不能命中缓存导致发送相同的资源
* 因为 `Last-Modified` 只能以秒计时，如果在不可感知的时间内修改完成文件，那么服务端会认为资源还是命中了，不会返回正确的资源

所以在 HTTP / 1.1 出现了 `ETag，`并且 `ETag` 优先级比 `Last-Modified` 高。

更多信息可看 xmind/coding/HTTP.xmind

---

2.vue双向绑定原理（很细节）

3.v-model原理

4.virtual Dom的理解及vitual doom中节点改变的算法

当然了 Virtual DOM 提高性能是其中一个优势，其实最大的优势还是在于：

* 将 Virtual DOM 作为一个兼容层，让我们还能对接非 Web 端的系统，实现跨端开发
* 同样的，通过 Virtual DOM 我们可以渲染到其他的平台，比如实现 SSR、同构渲染等等
* 实现组件的高度抽象化

5.DefineProperty相关

6.webpack用它做什么，用过什么插件，如何将常用插件打包

7.rem布局原理

```js
'use strict';

/**
 * @param {Boolean} [normal = false] - 默认开启页面压缩以使页面高清;  
 * @param {Number} [baseFontSize = 100] - 基础fontSize, 默认100px;
 * @param {Number} [fontscale = 1] - 有的业务希望能放大一定比例的字体;
 */
const win = window;
export default win.flex = (normal, baseFontSize, fontscale) => {
  const _baseFontSize = baseFontSize || 100;
  const _fontscale = fontscale || 1;

  const doc = win.document;
  const ua = navigator.userAgent;
  const matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
  const UCversion = ua.match(/U3\/((\d+|\.){5,})/i);
  const isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >= 80;
  const isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
  let dpr = win.devicePixelRatio || 1;
  if (!isIos && !(matches && matches[1] > 534) && !isUCHd) {
    // 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
    dpr = 1;
  }
  const scale = normal ? 1 : 1 / dpr;

  let metaEl = doc.querySelector('meta[name="viewport"]');
  if (!metaEl) {
    metaEl = doc.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    doc.head.appendChild(metaEl);
  }
  metaEl.setAttribute('content', `width=device-width,user-scalable=no,initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale}`);
  doc.documentElement.style.fontSize = normal ? '50px' : `${_baseFontSize / 2 * dpr * _fontscale}px`;
};
```





