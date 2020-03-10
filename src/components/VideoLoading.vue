<template>
    <div class="video_loading">
        <i class="iconfont iconvidedoloading"></i>
    </div>
</template>


<style lang="scss" scoped>
.video_loading {
    width: 0.5rem;
    height: 0.5rem;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    margin-top: -0.25rem;
    margin-left: -0.25rem;
    color: rgba(255, 255, 255, .8);
    animation: video_loading 1s infinite;
    text-align: center;
    line-height: 0.5rem; 
    .iconfont {
        font-size: 0.5rem;
    }
}
@keyframes video_loading {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>