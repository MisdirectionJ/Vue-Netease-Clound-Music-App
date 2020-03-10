<template>
  <div class="big_alert" >
    <div class="interface" @click="hiddenAlert"></div>
    <div class="option">
      <ul>
        <li @click="toReplay">回复评论</li>
        <li @click="toShare">分享评论</li>
        <li v-if="otherUserId === userId" @click="toRemove">删除评论</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  props: {
    otherUserId: Number
  },
  computed: {
    ...mapState(["userId"])
  },
  methods: {
    hiddenAlert() {
      this.$emit("toggleAlertOption", true);
    },
    toReplay() {
      this.$emit("readyreplay");
    },
    toRemove() {
      this.$emit("removeMessage");
    },
    toShare() {
      // this.$emit();
    }
  }
};
</script>
<style lang="scss" scoped>
.big_alert {
  .interface {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .option {
    position: absolute;
    left: 50%;
    margin-left: -1.25rem;
    top: 40%;
    width: 2.5rem;
    background: #fff;
    border-radius: 0.05rem;
    animation: alert 0.3s linear;
    ul {
      > li {
        font-size: 0.13rem;
        padding-left: 0.15rem;
        line-height: 0.4rem;
      }
    }
  }
  @keyframes alert {
    0% {
      transform: scale(0.8);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
}
</style>
