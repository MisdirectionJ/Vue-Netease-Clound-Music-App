<template>
  <div class="remove_box">
    <div class="interface" @click="cancaleSelect"></div>
    <div class="remove_alert">
      <div class="are_ready">{{ removeAlertMessage.title }}?</div>
      <div class="select">
        <span @click="agreeRemove">{{ removeAlertMessage.remove }}</span>
        <span @click="cancaleSelect">取消</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
  computed: {
    ...mapState(['removeAlertMessage'])
  },
  methods: {
    ...mapMutations({ setFlag: "SETREMOVE_ALERT_FLAG" }),
    agreeRemove() {
      this.setFlag({el: this.removeAlertMessage.flag, flag: true});
    },
    cancaleSelect() {
      this.$store.state.fullRemoveFlag = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.remove_box {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  .interface {
    z-index: 2;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
}
.remove_alert {
  z-index: 2;
  box-sizing: border-box;
  padding: 0.2rem;
  position: absolute;
  left: 50%;
  top: 35%;
  margin-left: -1.4rem;
  width: 2.8rem;
  height: 1rem;
  background: #fff;
  font-size: 0.13rem;
  border-radius: 0.1rem;
  animation: alert 0.3s;
  @keyframes alert {
    0% {
      transform: scale(0.9);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
  .are_ready {
    color: #999999;
  }
  .select {
    margin-top: 0.3rem;
    text-align: center;
    display: flex;
    flex-direction: row-reverse;
    color: #bc443d;
    span {
      width: 0.5rem;
    }
  }
}
</style>
