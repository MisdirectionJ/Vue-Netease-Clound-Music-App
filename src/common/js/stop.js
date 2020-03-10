export const debounce = function (callback, delay) { //防抖
    let time
    return function (args) {
        if (time) clearTimeout(time) 
        time = setTimeout(() => {
            callback && callback.call(this, args)
        }, delay)
    }
}
export const throttle = function (callback, delay) { //节流
    let time
    return function (args) {
        if (!time) {
            time = setTimeout(() => {
                time = null
                callback && callback.call(this, args)
            }, delay)
        }
    }
}