<template>
  <div class="small_alert">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.small_alert {
  height: 0.3rem;
  padding: 0 0.1rem;
  text-align: center;
  border-radius: 0.12rem;
  line-height: 0.3rem;
  background: #fff;
  position: absolute;
  bottom: 1rem;
  left: 50%;
  font-size: 0.12rem;
  box-shadow: 0 0 0.1rem #ccc;
  animation: small_alert 0.3s;
  transform: translateX(-50%);
}
@keyframes small_alert {
  0% {
    transform: translate(-50%, 0.3rem) scale(0.5);
  }
  75% {
    transform: translateX(-50%) scale(1.1);
  }
  100% {
    transform: translateX(-50%) scale(1);
  }
}
</style>
