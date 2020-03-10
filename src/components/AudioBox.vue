<template>
  <div class="audio_play">
    <transition name="audio_fade">
      <div class="audio_box" v-show="audioBoxFlag">
        <div
          class="bottom_bg"
          :style="'background-image: url(' + songDetil.al.picUrl + ')'"
        ></div>
        <TopHeader>
          <template #left>
            <div class="left">
              <i class="iconfont iconleft" @click="changeAudioBox(false)"></i>
              <div class="name">
                <p class="song_name">{{ songDetil.name }}{{ (songDetil.alia && songDetil.alia.length) ? "(" + songDetil.alia[0] + ")" : "" }}</p>
                <p class="artlist_name">
                  {{ songDetil.ar ? songDetil.ar.map(item => item.name).join("/") : '暂无' }}
                </p>
              </div>
            </div>
          </template>
          <template #right>
            <div class="right">
              <i class="iconfont iconshare"></i>
            </div>
          </template>
        </TopHeader>

        <!-- 中间歌词 -->
        <div class="container">
          <header>
            <div class="line_box" v-show="lrcFlag" @click="changeVolume">
              <i class="iconfont iconfulllaba" @click.stop="offVolume"></i>
              <div class="bottom"></div>
              <div class="top" ref="topVolume"></div>
              <div class="ball" @touchmove="volumeTouchmoveEvent"></div>
            </div>
            <div
              v-show="!lrcFlag"
              :class="['gif_box', songFlag ? 'gif_start' : 'gif_stop']"
            ></div>
          </header>
          <div class="img_box" v-show="!lrcFlag" @click="changeLrcFlag">
            <div
              v-show="songDetil.al.picUrl"
              :style="'background-image: url(' + songDetil.al.picUrl + ')'"
              :class="['rotate_box', !songFlag && 'paused']"
            ></div>
          </div>
          <div class="lrc_box" v-show="lrcFlag" @click="changeLrcFlag">
            <ul ref="lrcBox">
              <template v-if="!lyricFlag">
                <li
                  ref="lrcEleList"
                  :data-time="item.time"
                  v-for="(item, index) in lrcList"
                  :key="index"
                  v-html="'<span>' + item.container + '</span><br/>'"
                >
                  <p>{{ item.container }}</p>
                </li>
              </template>
              <template v-else>
                <li
                  ref="lrcEleList"
                  :data-time="item.time"
                  v-for="(item, index) in lrcList"
                  :key="index"
                  v-html="
                    '<span>' +
                      item.container +
                      '</span><br/><span>' +
                      (item.translate ? item.translate : '') +
                      '</span>'
                  "
                ></li>
              </template>
            </ul>
            <p v-if="!lrcList.length">{{ lrcErrorMessage }}</p>
          </div>
        </div>
        <!-- 底部 -->
        <div class="option_bottom">
          <div v-show="!lrcFlag" class="love_message">
            <div @click="getLoveHeart" class="heart">
              <i
                :class="['iconfont', loveFlag ? 'iconlove' : 'iconfull_heart']"
              ></i>
            </div>
            <div class="message" @click="toComment">
              <i class="iconfont iconcomment"></i>
              <span class="count">{{ total | commentCount }}</span>
            </div>
            <i class="iconfont icondetil"></i>
          </div>
          <div class="line_box">
            <div class="start">
              <span>{{ startTime }}</span>
            </div>
            <div class="line" @click="changeTime">
              <div class="line_bottom"></div>
              <div ref="lineTop" class="line_top"></div>
              <div
                class="line_ball"
                @touchmove="touchmoveEvent"
                @touchend="touchendEvent"
              ></div>
            </div>
            <div class="end">
              <span>{{ endTime }}</span>
            </div>
          </div>
          <div class="option">
            <i
              :class="['iconfont', pattern.icon]"
              @click="changeStartModel"
            ></i>
            <i class="iconfont iconprevious" @click="nextSong(true, true)"></i>
            <i
              class="iconfont"
              :class="[songFlag ? 'iconzanting' : 'iconbofang']"
              @click="stopOrStartMusic"
            ></i>
            <i class="iconfont iconnext" @click="nextSong(false, true)"></i>
            <i class="iconfont iconfontzhaikai" @click="showOrHideSongList"></i>
          </div>
        </div>
        <audio
          @timeupdate="songPlaying"
          ref="audio"
          :src="songUrl"
          @canplay="canPlayEvent"
          @pause="songFlag = false"
          @play="songFlag = true"
          @ended="nextSong(false, false)"
        ></audio>
      </div>
    </transition>
    <SmallAudioBox
      v-show="!audioBoxFlag && songId"
      :songFlag="songFlag"
      :songDetil="songDetil"
      :rate="audio ? (audio.currentTime / audio.duration) : 0" 
      :showLrcMessage="showLrcMessage"
      @stopOrStartMusic="stopOrStartMusic"
    ></SmallAudioBox>
    <SmallSongList v-show="smalllistFlag"></SmallSongList>
    <SmallAlert v-if="mehodsAlert">
      {{ pattern.message }}
    </SmallAlert>
  </div>
</template>
<script>
import TopHeader from "components/TopHeader";
import SmallSongList from "components/SmallSongList";
import SmallAlert from "components/SmallAlert";
import SmallAudioBox from "components/SmallAudioBox";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  components: {
    TopHeader,
    SmallSongList,
    SmallAudioBox,
    SmallAlert,
  },
  data() {
    return {
      songFlag: true,
      lyricFlag: false,
      loveFlag: true,
      mehodsAlert: false,
      lrcPosition: 0,
      total: "",
      endTime: "00:00",
      startTime: "00:00",
      songDetil: { name: "", ar: [], al: { picUrl: "" } },
      lrcList: [],
      lrcErrorMessage: "歌词加载中...",
      lrcIndex: null,
      showLrcMessage: ""
    };
  },
  computed: {
    ...mapState([
      "songId",
      "songList",
      "songIndex",
      "audio",
      "smalllistFlag",
      "songUrl",
      "lrcFlag",
      "pattern",
      "userId",
      "audioBoxFlag"
    ])
  },
  mounted() {
    this.setAudio(this.$refs.audio);
    this.lineTop = this.$refs.lineTop;
    this.lineBall = this.lineTop.nextElementSibling;
    this.line = this.lineTop.parentElement;
    this.topVolume = this.$refs.topVolume;
    this.lrcBox = this.$refs.lrcBox;
    this.volumeBall = this.topVolume.nextElementSibling;
    this.volumeBox = this.topVolume.parentElement;
    this.changeWidth(this.volumeBall, this.topVolume, this.audio.volume);
  },
  watch: {
    songId(val) {
      if (val) {
        Object.assign(this.$data, this.$options.data());
        this.changeWidth(this.lineBall, this.lineTop, 0);
        this.lrcBox.style.transform = "translateY(0)";
        this.startMusic();
      }
    },
    audioBoxFlag(val) {
      if (val && this.lrcList.length) {
        this.$nextTick(() => {
          this.checkHaveLrc();
        });
      }
    },
    lrcFlag(val) {
      if (val && this.lrcList.length) {
        this.$nextTick(() => {
          this.checkHaveLrc();
        });
      }
    }
  },
  methods: {
    ...mapMutations({
      setAudio: "SET_AUDIO",
      changeLrcFlag: "LRC_BOX_FLAG",
      showOrHideSongList: "CHANGE_SONG_LIST_FLAG",
      selectSong: "SELECT_SONG",
      changeModel: "PLAY_MEHODS",
      changeAudioBox: "AUDIO_BOX_FLAG"
    }),
    ...mapActions(["checkSong"]),
    startMusic() {
      this.getCommentCount(); //获取评论数
      this.getLoveList(); //获取用户喜欢列表
      this.getLyric(); //获取歌词
      this.songDetil = this.songList[this.songIndex];
    },

    //操作歌曲
    async nextSong(nextFlag, singleFlag) {
      this.songFlag = false;
      if (
        this.songList.length === 1 ||
        (this.pattern.method === "single" && !singleFlag)
      )
        return this.initOneSong();
      this.selectSong(nextFlag);
      const init = await this.checkSong();
      if (init && init.init) this.initOneSong();
    },
    changeStartModel() {
      clearTimeout(this.time);
      this.mehodsAlert = false;
      this.changeModel();
      this.$nextTick(() => {
        this.mehodsAlert = true;
      });
      this.time = setTimeout(() => {
        this.mehodsAlert = false;
      }, 3000);
    },
    //单首歌重置
    initOneSong() {
      this.lrcPosition = 0;
      this.lrcBox.style.transform = "translateY(0)";
      this.audio.currentTime = 0;
    },
    //暂停播放
    stopOrStartMusic() {
      if (this.songFlag) this.audio.pause();
      else this.audio.play();
    },
    toComment() {
      this.$store.state.commentDetil = {
        type: "music",
        id: this.songDetil.id,
        picUrl: this.songDetil.al.picUrl,
        name: this.songDetil.name,
        nickname: this.songDetil.ar.map(item => item.name).join("/"),
        numType: 0
      };
      this.$router.push("/home/comment");
    },
    //声音点击跳跃
    changeVolume(e) {
      if (e.target === this.volumeBall) return;
      let rate = e.offsetX / this.volumeBox.offsetWidth;
      if (rate > 1 || rate < 0) return;
      this.changeWidth(this.volumeBall, this.topVolume, rate);
      this.audio.volume = rate;
    },
    //声音移动跳跃
    volumeTouchmoveEvent(e) {
      const moveX =
        e.touches[0].clientX -
        (this.volumeBox.parentElement.offsetWidth -
          this.volumeBox.offsetWidth) /
          2;
      const rate = moveX / this.volumeBox.offsetWidth;
      if (rate > 1 || rate < 0) return;
      this.changeWidth(this.volumeBall, this.topVolume, rate);
      this.audio.volume = rate;
    },
    //静音
    offVolume() {
      this.audio.volume = 0;
      this.changeWidth(this.volumeBall, this.topVolume, 0);
    },
    //音乐点击跳跃
    changeTime(e) {
      if (e.target === this.lineBall) return;
      const rate = e.offsetX / this.line.offsetWidth;
      if (rate > 1 || rate < 0) return;
      this.changeWidth(this.lineBall, this.lineTop, rate);
      this.audio.currentTime = this.audio.duration * rate;
      if (this.lrcList.length) this.checkHaveLrc();
    },
    //音乐移动跳跃
    touchmoveEvent(e) {
      this.songFlag = false;
      const moveX =
        e.touches[0].clientX -
        (this.line.parentElement.offsetWidth - this.line.offsetWidth) / 2;
      const rate = moveX / this.line.offsetWidth;
      if (rate > 1 || rate < 0) return;
      this.changeWidth(this.lineBall, this.lineTop, rate);
      this.audio.currentTime = this.audio.duration * rate;
    },
    //音乐移动结束
    touchendEvent() {
      this.songFlag = true;
      if (this.lrcList.length) this.checkHaveLrc();
    },
    //可以播放事件
    canPlayEvent() {
      this.audio.play();
      this.songFlag = true;
      this.endTime = this.getTime(this.audio.duration);
    },
    //歌曲播放中
    songPlaying() {
      this.startTime = this.getTime(this.audio.currentTime);
      this.getIrcOption(this.audio.currentTime);
      const rate = this.audio.currentTime / this.audio.duration;
      this.changeWidth(this.lineBall, this.lineTop, rate);
    },

    //工具函数
    getTime(time) {
      //获取 00：00格式的时间
      let minute = Math.floor(time / 60);
      minute = minute >= 10 ? minute : "0" + minute;
      let second = Math.floor(time % 60);
      second = second >= 10 ? second : "0" + second;
      return minute + ":" + second;
    },
    changeWidth(line, ball, rate) {
      line.style.left = rate * 100 + "%";
      ball.style.width = rate * 100 + "%";
    },
    getIrcTime(str) {
      const time = str.split(".");
      let s;
      if (time[1]) {
        s = time[1] / 10 ** time[1].toString().length;
      }
      return s + time[0].split(":")[0] * 60 + (time[0].split(":")[1] - 0);
    },
    //获取歌词数组
    getIrcList(lrc, tlyric) {
      const lrcArr = lrc.split("\n");
      const reg = /\[(.+)\]/g;
      lrcArr.forEach(item => {
        let timeStr = item.match(reg);
        if (timeStr) {
          let dataTime = RegExp.$1.replace(/\[\]/g, "");
          let time = this.getIrcTime(dataTime);
          if (!Number.isNaN(time)) {
            let container = item.replace("[" + dataTime + "]", "");
            if (container) this.lrcList.push({ time, container });
          }
        }
      });
      if (!tlyric) return;
      const tlyricArr = tlyric.split("\n");
      tlyricArr.forEach(item => {
        let timeStr = item.match(reg);
        if (timeStr) {
          let dataTime = RegExp.$1.replace(/\[\]/g, "");
          let time = this.getIrcTime(dataTime);
          if (time) {
            let translate = item.replace("[" + dataTime + "]", "");
            const index = this.lrcList.findIndex(item => {
              return item.time === time;
            });
            if (index >= 0) this.lrcList[index].translate = translate;
          }
        }
      });
    },
    //歌词移动
    getIrcOption(time) {
      const index = this.getIrcIndex(time);
      if (this.lrcIndex === index) return;
      if (index >= 0) {
        this.showLrcMessage = this.lrcEleList[index].innerText;
        if (!this.audioBoxFlag || !this.lrcFlag) return;
        this.lrcPosition -= this.lrcEleList[index].offsetHeight / 100; //隐藏后检测不到高度
        this.lrcBox.style.transform = "translateY(" + this.lrcPosition + "rem)";
        if (this.lrcIndex !== null && this.lrcIndex >= 0) {
          this.lrcEleList[this.lrcIndex].classList.remove("add_color");
          this.lrcIndex = null;
        }
        this.lrcEleList[index].classList.add("add_color");
        this.lrcIndex = index;
      }
    },
    // 获取匹配的歌词项
    getIrcIndex(currentTime) {
      if (!this.lrcEleList || !this.lrcEleList.length) return;
      return this.lrcEleList.findIndex((item, i) => {
        if (this.lrcEleList[i + 1]) {
          return (
            Number.parseInt(item.dataset.time) <= currentTime &&
            (Number.parseInt(this.lrcEleList[i + 1].dataset.time) >
              currentTime ||
              !this.lrcEleList[i + 1].dataset.time)
          )
          } else {
            if(this.lrcIndex && this.lrcEleList.length - 1 === i) return i
        }
      });
    },

    //操作进度条后 重新计算translate
    checkHaveLrc() {
      const index = this.getIrcIndex(this.audio.currentTime);
      if (index > -1) {
        this.lrcPosition = -this.lrcEleList[index].offsetTop / 100;
        this.lrcBox.style.transform = "translateY(" + this.lrcPosition + "rem)";
      }
    },

    //请求
    async getCommentCount() {
      const { total } = await this.$getAxios(
        `/comment/music?id=${this.songId}&limit=1`
      );
      this.total = total;
    },

    async getLyric() {
      const {
        uncollected,
        lrc,
        tlyric,
        transUser,
        lyricUser,
        nolyric
      } = await this.$getAxios(`/lyric?id=${this.songId}`);
      if (uncollected || nolyric) {
        this.lrcErrorMessage = "暂无歌词";
        return;
      }
      this.getIrcList(lrc.lyric, tlyric.lyric);
      if (tlyric.lyric) this.lyricFlag = true;
      if (transUser) {
        this.lrcList.push({
          container: "歌词翻译者: " + transUser.nickname
        });
      }
      if (lyricUser) {
        this.lrcList.push({
          container: "歌词贡献者: " + lyricUser.nickname
        });
      }
      this.$nextTick(() => {
        this.lrcEleList = this.$refs.lrcEleList;
      });
    },
    async getLoveList() {
      if (!this.userId) return;
      const { ids } = await this.$getAxios("/likelist?uid=" + this.userId);
      this.loveFlag = !ids.includes(this.songId);
    },
    async getLoveHeart(e) {
      const ele = e.target.classList;
      const { code } = await this.$getAxios(
        `/like?id=${this.songId}&type=${this.loveFlag}`
      );
      if (code !== 200) return;
      this.loveFlag = !this.loveFlag;
      this.$nextTick(() => {
        ele.add("bounce");
      });
      let time = setTimeout(() => {
        clearTimeout(time);
        ele.remove("bounce");
      }, 500);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.audio_play {
  .audio_fade-enter-active,
  .audio_fade-leave-active {
    transition: all 0.3s;
  }
  .audio_fade-enter,
  .audio_fade-leave-to {
    transform: translate3d(0, 10%, 0);
    opacity: 0;
  }
  .audio_box {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: #767676;
    .bottom_bg {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-size: 100% 100%;
      filter: blur(1rem);
    }
    .top_header {
      position: relative;
      display: flex;
      justify-content: space-between;
      background-color: transparent;
      .left {
        display: flex;
        width: calc(100% - 0.2rem);
        .name {
          display: flex;
          justify-content: center;
          flex-direction: column;
          width: calc(100% - 0.3rem);
          box-sizing: border-box;
          p {
            margin: 0;
            line-height: 0.2rem;
            @include text-overflow-one;
          }
          .song_name {
            font-size: $normal-font;
            color: #fff;
          }
          .artlist_name {
            font-size: $best-small-font;
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
    .container {
      position: relative;
      width: 100%;
      padding-top: 0.5rem;
      height: 3.3rem;
      header {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0.1rem;
        .line_box {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: 75%;
          height: 2px;
          .iconfont {
            position: absolute;
            color: rgba(255, 255, 255, 0.5);
            font-size: $best-small-font;
            top: -0.05rem;
            left: -0.2rem;
          }
          > div {
            position: absolute;
            left: 0;
            top: 0;
            height: 2px;
          }
          .bottom {
            width: 100%;
            background-color: rgba(255, 255, 255, 0.3);
          }
          .top {
            background-color: #fff;
            width: 100%;
          }
          .ball {
            height: 0.08rem;
            width: 0.08rem;
            top: 50%;
            background: #fff;
            transform: translate(-50%, -50%);
            left: 100%;
            border-radius: 50%;
          }
        }
        .gif_box {
          background-image: url(~common/images/needle.png);
          position: absolute;
          background-size: contain;
          background-repeat: no-repeat;
          transform-origin: left top;
          left: 46%;
          z-index: 1;
          top: -0.1rem;
          width: 1.26rem;
          height: 1.342rem;
          transform: rotate(-20deg);
        }
        .gif_start {
          animation: gif_start 0.3s linear forwards;
        }
        .gif_stop {
          animation: gif_stop 0.3s linear forwards;
        }
        @keyframes gif_start {
          100% {
            transform: rotate(0);
          }
        }
        @keyframes gif_stop {
          0% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(-20deg);
          }
        }
      }
      .img_box {
        margin: 0 auto;
        border-radius: 50%;
        width: 2.5rem;
        position: relative;
        height: 2.5rem;
        background: url(~common/images/disc.png) no-repeat center;
        background-size: cover;
        .rotate_box {
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -0.75rem;
          margin-top: -0.75rem;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background-size: cover;
          background-repeat: no-repeat;
          animation: img_rotate 15s linear infinite;
        }
        .paused {
          animation-play-state: paused;
        }
        @keyframes img_rotate {
          0% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }
      .lrc_box {
        width: 100%;
        height: calc(100vh - 2.45rem);
        position: absolute;
        left: 0;
        top: 0.3rem;
        text-align: center;
        overflow: hidden;
        p {
          width: 100%;
          margin: 0;
          text-align: center;
          position: absolute;
          left: 0;
          top: 1.8rem;
          color: #fff;
          font-size: $normal-font;
        }
        ul {
          width: 100%;
          position: absolute;
          left: 0;
          top: 1.5rem;
          box-sizing: border-box;
          transition: transform 0.3s linear;
          > li {
            width: 100%;
            box-sizing: border-box;
            font-size: $normal-font;
            text-align: center;
            padding: 0 0.3rem 0.1rem 0.3rem;
            line-height: 0.2rem;
            color: rgba(255, 255, 255, 0.7);
          }
          .add_color {
            color: #fff;
          }
        }
      }
    }
    .option_bottom {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 1.5rem;
      width: 100%;
      .love_message {
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 0.5rem;
        position: relative;
        height: 0.5rem;
        line-height: 0.5rem;
        .bounce {
          display: block;
          animation: heart_bounce 0.5s;
        }
        @keyframes heart_bounce {
          0% {
            transform: scale(1.3);
          }
          50% {
            transform: scale(0.7);
          }
          100% {
            transform: scale(1);
          }
        }
        .iconfont {
          font-size: 0.25rem;
          color: #fff;
        }
        .iconfull_heart {
          color: $main-background;
        }
        .icondetil {
          position: absolute;
          right: 0.1rem;
        }
        .message {
          position: relative;
          .count {
            position: absolute;
            left: 0.1rem;
            top: -0.15rem;
            font-size: $best-small-font;
            color: #fff;
            transform: scale(0.8);
          }
        }
      }
      .line_box {
        box-sizing: border-box;
        padding: 0 0.1rem;
        width: 100%;
        height: 0.3rem;
        display: flex;
        justify-content: space-between;
        line-height: 0.3rem;
        position: absolute;
        left: 0;
        top: 0.5rem;
        .line {
          position: absolute;
          left: 50%;
          top: 50%;
          width: calc(100% - 1rem);
          height: 0.3rem;
          transform: translate(-50%, -50%);
          > div {
            position: absolute;
            width: 100%;
            height: 0.02rem;
            top: 50%;
            transform: translateY(-50%);
          }
          .line_bottom {
            background-color: rgba(255, 255, 255, 0.3);
          }
          .line_top {
            width: 0;
            background-color: #fff;
          }
          .line_ball {
            width: 0.1rem;
            height: 0.1rem;
            top: 50%;
            background: #fff;
            transform: translate(-50%, -50%);
            left: 0;
            border-radius: 50%;
          }
        }
        .start,
        .end {
          font-size: $best-small-font;
          color: #fff;
          transform: scale(0.8);
        }
      }
      .option {
        width: 100%;
        height: 0.7rem;
        display: flex;
        line-height: 0.7rem;
        position: absolute;
        left: 0;
        top: 0.8rem;
        justify-content: space-around;
        .iconfont {
          font-size: 0.2rem;
          color: #fff;
        }
        .iconbofang,
        .iconzanting {
          font-size: 0.4rem;
        }
      }
    }
  }

}
</style>
