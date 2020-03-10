<template>
  <transition name="audio_slide">
    <div class="small_audio_box">
      <div class="left">
        <div class="img_box" @click="changeAudioBox(true)">
          <img :src="songDetil.al.picUrl" alt="" />
        </div>
        <div class="name">
          <p class="song_name">
            {{ songDetil.name
            }}{{
              songDetil.alia && songDetil.alia.length
                ? "(" + songDetil.alia[0] + ")"
                : ""
            }}
          </p>
          <p class="list_message">
            {{
              showLrcMessage || songDetil.ar.map(item => item.name).join("/")
            }}
          </p>
        </div>
      </div>
      <div class="option">
        <i
          :class="[
            'iconfont',
            songFlag ? 'iconzanting-small' : 'iconbofang_empty'
          ]"
          @click="$emit('stopOrStartMusic')"
        ></i>
        <i class="iconfont iconzhankai_empty" @click="showOrHideSongList"></i>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          @click="$emit('stopOrStartMusic')"
        >
          <circle
            cx="0.25rem"
            cy="0.25rem"
            r="0.2rem"
            stroke-width="1"
            stroke="transparent"
            fill="none"
          ></circle>
          <circle
            ref="cir"
            cx="0.25rem"
            cy="0.25rem"
            r="0.2rem"
            stroke-width="1"
            stroke="#DD4037"
            fill="none"
            stroke-dashoffset="-0.95rem"
            :stroke-dasharray="width * rate + 'rem' + ' ' + width * (1 - rate) + 'rem'"
          ></circle>
        </svg>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      width: 0
    };
  },
  props: {
    songFlag: Boolean,
    songDetil: Object,
    showLrcMessage: String,
    rate: Number
  },
  methods: {
    ...mapMutations({
      showOrHideSongList: "CHANGE_SONG_LIST_FLAG",
      changeAudioBox: "AUDIO_BOX_FLAG"
    })
  },
  mounted() {
    this.width = Number.parseFloat(this.$refs.cir.getAttribute("r")) * 2 * Math.PI;
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.audio_slide-enter-active,
.audio_slide-leave-active {
  transition: all 0.3s;
}
.audio_slide-enter,
.audio_slide-leave-to {
  transform: translateY(0.5rem);
  opacity: 0;
}
.small_audio_box {
  border-top: 1px solid $border-color;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.5rem;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 0.1rem;
  .left {
    display: flex;
    .img_box {
      width: 0.5rem;
      height: 0.5rem;
      margin-right: 0.1rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    @include play_list(0.1rem);
    .name {
      width: calc(100vw - 1.5rem);
    }
  }
  .option {
    position: relative;
    svg {
      width: 0.25rem;
      height: 0.25rem;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      circle {
        transition: stroke-dasharray 0.25s;
        transform: scale(0.5);
      }
    }
    .iconfont {
      font-size: 0.25rem;
      line-height: 0.5rem;
      color: #999;
    }
    .iconzhankai_empty {
      margin-left: 0.1rem;
      color: #000;
    }
  }
}
</style>
