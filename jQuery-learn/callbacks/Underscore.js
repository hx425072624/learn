(function (root) {
    var optionsCache = {}
    var _ = {
        callbacks: function (options) {
            options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : {}
            var list = []
            var index, length, testing, memory, start, starts;
            var fire = function (data) {
                memory = options.memory && data;
                index = starts || 0;
                start = 0;
                testing = true;
                length = list.length
                for (; index < length; index++) {
                    // 执行函数返回值是false 并且 自身配置 是 stopOnFalse
                    if (list[index].apply(data[0], data[1]) === false && options.stopOnFalse) {
                        break;
                    }
                }
            }

            var self = {
                add: function () {
                    var args = Array.prototype.slice.call(arguments);
                    start = list.length;
                    args.forEach(function (fn) {
                        if (toString.call(fn) === "[object Function]") {
                            list.push(fn)
                        }
                    })

                    // 如果是memory，则使用starts
                    if (memory) {
                        starts = start
                        fire(memory)
                    }
                },
                fireWith: function (context, arguments) {
                    var args = [context, arguments]
                    // 如果配置没有配置once 或者 一次都没有执行过
                    if (!options.once || !testing) {
                        fire(args)
                    }
                },
                fire: function () {
                    self.fireWith(this, arguments)
                }
            }

            return self;
        }
    }

    function createOptions(options) {
        var object = optionsCache[options] = {}
        options.split(/\s+/).forEach(value => {
            object[value] = true
        });
        return object
    }

    root._ = _;
})(this)