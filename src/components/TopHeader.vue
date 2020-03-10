<template>
  <div class="top_header">
    <slot name="left"></slot><slot name="center"></slot
    ><slot name="right"></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable.scss";
.top_header {
  display: flex;
  line-height: 0.5rem;
  width: 100%;
  height: 0.5rem;
  box-sizing: border-box;
  padding: 0 0.1rem;
  color: #fff;
  background-color: $main-background;
  [class^="iconfont"] {
    font-size: 0.15rem;
    color: #fff;
  }
  [class*="iconleft"] {
    margin-right: 0.1rem;
  }
}
</style>
