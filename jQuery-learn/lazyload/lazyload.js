(function (jQuery) {
    function load (element) {
        //如果有data-src属性，则把data-src属性赋值给src
        if (element.getAttribute('data-src')) {
            element.src = element.getAttribute('data-src')
        }
    }
    //设置图片已加载的标记
    function setLoaded (element) {
        element.setAttribute('data-src', true)
    }
    //判断图片是否已加载
    function hasLoaded (element) {
        element.getAttribute('data-src') === 'true'
    }
    //元素进入可视区域时 懒加载图片
    function onIntersection (load) {
        return function (entries, observer) {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0) {
                    // 先移除监视
                    observer.unobserve(entry.target)
                    // 如果当前元素没有加载
                    if (!hasLoaded(entry.target)) {
                        load(entry.target)
                        setLoaded(entry.target)
                    }
                }
            });
        }
    }

    jQuery.fn.extend({
        lazyload: function () {
            var selector = this.selector;
            // 获取每个节点
            var elements = document.querySelectorAll(selector)
            var observer = null;
            // 判断是否支持IntersectionObserver
            if (window.IntersectionObserver) {
                observer = new IntersectionObserver(onIntersection(load), { thresholds: 0 })
            }

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                //如果图片已经加载过，则跳过本次循环
                if (hasLoaded(element)) {
                    continue;
                }

                if (observer) {
                    observer.observe(element);
                    continue;
                }
                // 如果不支持 window.IntersectionObserver 则加载图片  
                load(element);
                setLoaded(element);
            }
        }
    })
})(jQuery);