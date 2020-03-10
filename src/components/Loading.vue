<template>
    <div class="loading_box">
        <div class="img_box">
            <img src="~common/images/loading.gif" alt="">
            <span>努力加载中...</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Loading'
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";

.loading_box {
    position: absolute;
    left: 50%;
    top: 50%;
    .img_box {
        display: flex;
        font-size: $best-small-font;
        width: 1rem;
        height: 0.25rem;
        position: absolute;
        color: $noselect-color;
        left: 50%;
        top: 50%;
        line-height: 0.25rem;
        transform: translate(-50%, -50%);
        img {
            width: 0.2rem;
            height: 0.2rem;
            margin-right: 0.05rem;
        }
    }
}
</style>