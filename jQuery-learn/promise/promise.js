// 第一步 实现promise的一个初步构建
// function myPromise(){
//     this.then = function(){
//         console.log("then method start!")
//     }
// }
// var boilWater=function(){
//     return new myPromise();
// }

// boilWater().then();

// 第二步 实现 成功与失败
// function myPromise(fn) {

//     let resolveCallback = null;
//     this.then = function (cb) {
//         resolveCallback = cb
//     }
//     function resolve(val) {
//         resolveCallback(val);
//     }

//     fn(resolve);
// }

// var boilWater = function () {
//     return new myPromise(function (resolve, reject) {
//         setTimeout(function () {
//             resolve("烧水！")
//         }, 2000)
//     });
// }

// boilWater().then(function (data) {
//     console.log(data)
//     console.log("结束")
// });

// // 第三步 支持链式 支持多个then()
// // 如果要支持多个then回调执行，队列！！！！
// function myPromise(fn) {

//    // let resolveCallback = null, 
//     self = this;//保证this的指向没有问题
//     self._resolve=[] // 保存then的回调

//     this.then = function (cb) {
//         self._resolve.push(cb)
//         return this; //加入链式 如果不return 后面跟的then无法执行
//         // resolveCallback = cb
//     }

//     function resolve(val) {
//         self._resolve.forEach(callback => {
//             callback(val)
//         });
//         // resolveCallback(val);
//     }

//     fn(resolve);
// }

// var boilWater = function () {
//     return new myPromise(function (resolve, reject) {
//         setTimeout(function () {
//             resolve("烧水！")
//         }, 2000)
//     });
// }
// var Tea = function () {
//     return new myPromise(function (resolve, reject) {
//         setTimeout(function () {
//             resolve("茶叶！")
//         }, 2000)
//     });
// }

// boilWater().then(function (data) {
//     console.log(data)
//     return Tea();
// }).then(function(data){
//     console.log(data)
// });

// // 第四步 引入状态 pending fulfilled rejected
// function myPromise(fn) {

//    let self = this;//保证this的指向没有问题
//     self._resolve = [] // 保存then的回调
//     self._state = 'pending'
//     this.then = function (cb) {
//         if (self._state === 'pending') {
//             self._resolve.push(cb)
//         }

//         return this; //加入链式 如果不return 后面跟的then无法执行
//     }

//     function resolve(val) {
//         setTimeout(function () { // 改变优先级
//             self._state = 'fulfilled'
//             self._resolve.forEach(callback => {
//                 callback(val)
//             });
//         }, 0)
//     }
//     fn(resolve);
// }

// var boilWater = function () {
//     return new myPromise(function (resolve, reject) {
//         resolve("烧水！")
//     });
// }
// var Tea = function () {
//     return new myPromise(function (resolve, reject) {
//         resolve("茶叶！")
//     });
// }

// boilWater().then(function (data) {
//     console.log(data)
//     return Tea();
// }).then(function (data) {
//     console.log(data)
// });

//第五步 串行  实现内部返回一个Promise 实现同步 

//串行 Promise 是指在当前 promise 达到 fulfilled 状态后，即开始进行下一个 promise（后邻 promise）。
//  then 方法该改变比较多啊，这里我解释下：
// 注意的是，new Promise() 中匿名函数中的 promise （promise._resolves 中的 promise）
//指向的都是上一个 promise 对象，
// 而不是当前这个刚刚创建的。

// 首先我们返回的是新的一个promise对象，因为是同类型，所以链式仍然可以实现。

// 其次，我们添加了一个 handle 函数，handle 函数对上一个 promise 的 then 中回调进行了处理，
// 并且调用了当前的 promise 中的 resolve 方法。
// 接着将 handle 函数添加到 上一个promise 的 promise._resolves 中，当异步操作成功后就会执行 handle 函数，
// 这样就可以执行当前 promise 对象的回调方法。我们的目的就达到了。   

function myPromise(fn) {
    let self = this; //这样我们不用担心某个时刻 this 指向突然改变问题。
    let value = null;
    self._resolve = [];//调用 then 方法，将回调放入 self._resolves 队列；
    self._status = 'PENDING';

    this.then = function (cb) {

        return new myPromise(function (resolve) {
            function handle(value) {//
                var ret = typeof cb === 'function' && cb(value) || value;
                //console.log(ret ['then']);
                //主要保证链式调用得到维持
                if (ret && typeof ret['then'] == 'function') {
                    ret.then(function (value) {
                        resolve(value);
                    });
                } else {
                    resolve(ret);
                }
            }

            if (self._status === 'PENDING') {
                self._resolve.push(handle);//执行了then 就拿到看回调函数
            } else if (self._status === 'FULFILLED') {
                handle(value);
            }
        })
    }
    function resolve(value) {
        //如果我传入的是一个不包含异步操作的函数，resolve就会先于 then 执行，
        //也就是说 promise._resolves 是一个空数组。
        //为了解决这个问题，我们可以在 resolve 中添加 setTimeout，
        //来将 resolve 中执行回调的逻辑放置到 JS 任务队列末尾。
        setTimeout(function () {
            self._status = "FULFILLED";
            self._resolve.forEach(function (callback) {
                callback(value);
            });
        }, 0);
    }
    fn(resolve);// 调用实例化传来的 函数  传入成功的函数
}


var boilwater = function () {
    return new myPromise(function (resolve, reject) {//resolve 成功 reject失败
        resolve("烧水！");
        //resolve 方法没有传过来？？？？ 比then 先执行
        //如果没有用 settimeout 
        //js 是单线程  如果有异步操作  按照流水形式执行 、
        // A : setTimeout(function(){
        //      resolve("茶叶！");     
        // }, 0);
        // B: function 
        // B -->A  

    })
}
var Tea = function () {
    return new myPromise(function (resolve, reject) {//resolve 成功 reject失败
        resolve("茶叶！");
    })
}

boilwater().then(function (data) {
    console.log(data);// 输出烧水 
    return Tea();
}).then(function (data) {
    console.log(data);
});
