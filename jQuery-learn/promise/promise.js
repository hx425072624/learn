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

// 第三步 支持链式 支持多个then()
// 如果要支持多个then回调执行，队列！！！！
function myPromise(fn) {

    let resolveCallback = null, 
    self = this;//保证this的指向没有问题
    self._resolve=[] // 保存then的回调

    this.then = function (cb) {
        self._resolve.push(cb)
        return this; //加入链式 如果不return 后面跟的then无法执行
        // resolveCallback = cb
    }

    function resolve(val) {
        self._resolve.forEach(callback => {
            callback(val)
        });
        // resolveCallback(val);
    }

    fn(resolve);
}

var boilWater = function () {
    return new myPromise(function (resolve, reject) {
        setTimeout(function () {
            resolve("烧水！")
        }, 2000)
    });
}
var Tea = function () {
    return new myPromise(function (resolve, reject) {
        setTimeout(function () {
            resolve("茶叶！")
        }, 2000)
    });
}

boilWater().then(function (data) {
    console.log(data)
    return Tea();
}).then(function(data){
    console.log(data)
});

// 第四步 引入状态 pending fulfilled rejected
// function myPromise(fn) {

//     let resolveCallback = null, rejectCallback = null,
//         self = this;//保证this的指向没有问题
//     self._resolve = [] // 保存then的回调
//     self._state = 'pending'
//     this.then = function (cb) {
//         if (self._state === 'pending') {
//             self._resolve.push(cb)
//         }

//         return this; //加入链式 如果不return 后面跟的then无法执行
//         // resolveCallback = cb
//     }
//     this.catch = function (cb) {
//         rejectCallback = cb
//     }

//     function resolve(val) {
//         setTimeout(function () { // 改变优先级
//             self._state = 'fulfilled'
//             self._resolve.forEach(callback => {
//                 callback(val)
//             });
//         }, 0)

//         // resolveCallback(val);
//     }
//     function reject(val) {
//         rejectCallback(val);
//     }

//     fn(resolve, reject);
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
