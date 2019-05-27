(function (jQuery) {
    let defaultRules = {
        required: function (value) {
            return value !== undefined && value !== null && value.length > 0;
        }, email: function (value) {
            return /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/.test(value) 
        }, tel: function (value) {
            return /^1[34578]\d{9}$/.test(value) 
        }, credit: function (value) {
            return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value) 
        }, max: function (value, param) {
            return value <= param
        }, min: function (value, param) {
            return value >= param
        }
    }

    jQuery.fn.extend({
        validate: function (options) {
            let isValid = true;//设置默认的valid为真
            let event = options.defaultEvent || 'change'
            // 获取第一个匹配的节点，form一个页面 一般只有一个
            let element = this[0];

            let rules = options.rules
            for (const item in rules) {
                if (rules.hasOwnProperty(item)) {
                    const rule = rules[item]; //rule => {tel: true}
                    for (const key in rule) {
                        if (rule.hasOwnProperty(key)) {
                            //判断defaultRules中是否有该规则
                            if (defaultRules[key]) {
                                // 添加处理函数给对应的需要验证的标签元素
                                $(`[name=${item}]`, this[0]).on(event, function () {
                                    let valid = defaultRules[key].call(null, $(this).val())
                                    if (!valid) {
                                        //append default error tag to validate input    
                                        $(this).after("<span>haha</span>")
                                        isValid = false
                                    }
                                })
                            }
                        }
                    }
                }
            }

            return isValid;
        }
    })
})(jQuery);