import BScroll from "better-scroll";

export default function(vm, el, prop = "scroll", click = true, methods = true, bounce = false) {
    if (!vm[prop]) {
      vm[prop] = new BScroll(el, {
        click,
        pullUpLoad: true,
        scrollX: !methods,
        scrollY: methods,
        bounce,
      });
    } else {
      vm[prop].refresh();
    }
    vm[prop].on("scroll", pos => {
      vm.scrollY = pos.y;
    });

}
