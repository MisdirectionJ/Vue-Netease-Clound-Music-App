export default  function (key, value) {
    let stroge = JSON.parse(window.localStorage.getItem(key) || '[]')
    if (stroge.length) {
        const index = stroge.findIndex(item => item.value === value)
        index >= 0 && stroge.splice(index, 1) 
    }
    stroge.unshift({value})
    window.localStorage.setItem(key, JSON.stringify(stroge))
}