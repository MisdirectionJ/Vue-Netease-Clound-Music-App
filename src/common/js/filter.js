import Vue from "vue";
Vue.filter("playcount", function(val, flag) {
  if (val > 100000000) return (val / 100000000).toFixed(1) + "亿";
  if (!flag && val > 100000) return Math.round(val / 10000) + "万";
  if (flag && val > 100000) return (val / 10000).toFixed(1) + "万";
  if (flag && val > 10000) return (val / 10000).toFixed(1) + "万";
  return val;
});
Vue.filter("saleTime", function(val) {
  const time = new Date(val);
  return (
    time.getFullYear() + "." + (time.getMonth() + 1) + "." + time.getDate()
  );
});
Vue.filter("durationTime", function(value) {
  let m = Math.floor(value / 1000 / 60);
  m = m >= 10 ? m : "0" + m;
  let s = Math.floor((value / 1000) % 60);
  s = s >= 10 ? s : "0" + s;
  return m + ":" + s;
});
Vue.filter("saleTime", function(val) {
  const time = new Date(val);
  return (
    time.getFullYear() + "." + (time.getMonth() + 1) + "." + time.getDate()
  );
});
Vue.filter("commentCount", function(val) {
  if (val >= 100000) {
    return "10w+";
  }
  if (val >= 10000) {
    return "1w+";
  }
  if (val >= 1000) {
    return "999+";
  }
  return val;
});
Vue.filter("timeComment", function(val) {
  let time = new Date(val);
  let now = new Date();
  if (now - time < 60000) {
    return "刚刚";
  } else if (now - time < 60 * 60000) {
    return Math.floor((now - time) / 60000) + "分钟前";
  } else if (
    time.getFullYear() === now.getFullYear() &&
    time.getMonth() === now.getMonth() &&
    time.getDate() + 1 === now.getDate()
  ) {
    let hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    let minutes =
      time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    return "昨天" + hours + ":" + minutes;
  } else if (
    time.getFullYear() === now.getFullYear() &&
    time.getMonth() === now.getMonth() &&
    time.getDate() === now.getDate()
  ) {
    let hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    let minutes =
      time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    return hours + ":" + minutes;
  } else if (time.getFullYear() === now.getFullYear()) {
    return time.getMonth() + 1 + "月" + time.getDate() + "日";
  } else {
    return (
      time.getFullYear() +
      "年" +
      (time.getMonth() + 1) +
      "月" +
      time.getDate() +
      "日"
    );
  }
});
