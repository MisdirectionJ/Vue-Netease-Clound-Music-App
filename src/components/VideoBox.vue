<template>
  <div class="video_bOx">
    <transition name="slide-fade">
      <TopHeader v-show="showOptionFlag">
        <template #left>
          <div class="title">
            <i class="iconfont iconleft" @click="$router.back()"></i>
            <span>{{ mvDetil.title }}</span>
          </div>
        </template>
        <template #right>
          <i class="iconfont iconshare-m"></i>
        </template>
      </TopHeader>
    </transition>
    <div class="video_container" @click="changeOptionFlag">
      <video
        ref="video"
        :src="url"
        @canplay="startVideo"
        @timeupdate="playUpdate"
        @ended="videoEnd"
      ></video>
      <div class="stop_play">
        <i
          @click.stop="stopOrPlay"
          :class="[
            'iconfont',
            showOptionFlag
              ? videoPlayFlag
                ? 'iconvideo-stop'
                : 'iconfullsanjiao'
              : ''
          ]"
        ></i>
      </div>
      <transition name="down_hidden">
        <div class="time_box" ref="time" v-show="showOptionFlag">
          <div>
            <span>{{ startTime }}</span> /
            <span class="end_time">{{ endTime }}</span>
          </div>
          <i
            class="iconfont iconquanping"
            @click="video.requestFullscreen()"
          ></i>
        </div>
      </transition>
      <div class="bottom_box" @click.stop="bounceVideo">
        <div class="bottom_line"></div>
        <div ref="line" class="top_line"></div>
        <div
          class="button"
          :style="{ visibility: showOptionFlag ? 'visible' : 'hidden' }"
          @touchmove="moveVideo"
          @touchend="moveEndVideo"
        ></div>
      </div>
      <VideoLoading v-if="videoLoadFlag"></VideoLoading>
    </div>
    <div
      class="video_cretor"
      ref="wrapper"
      @touchstart="removeUser"
      v-show="Object.keys(aboutVideo).length"
    >
      <div class="scroll_box">
        <div class="video_message">
          <h5>
            {{ mvDetil.title }}
          </h5>
          <ul class="grounp" :class="videoDetil.videoGroup && 'new_class'">
            <li>
              {{ mvDetil.playTime || videoDetil.playCount | playcount }}次观看
            </li>
            <template v-if="videoDetil.videoGroup">
              <li v-for="(item, index) in videoDetil.videoGroup" :key="index">
                {{ item.name }}
              </li>
            </template>
          </ul>
          <div v-if="videoDetil.desc" class="time_send">
            <p>{{ videoDetil.publishTime }}发布</p>
            <p>{{ videoDetil.desc }}</p>
          </div>
          <ul class="iconfont_group">
            <li>
              <i class="iconfont iconzan"></i>
              <span>{{
                videoDetil.praisedCount || videoDetil.subCount || "点赞"
              }}</span>
            </li>
            <li>
              <i class="iconfont iconshoucang-m"></i>
              <span>{{
                videoDetil.subscribeCount || videoDetil.subCount || "收藏"
              }}</span>
            </li>
            <li>
              <i class="iconfont iconfont iconcomment-s"></i>
              <span>{{ commentCount || "评论" }}</span>
            </li>

            <li>
              <i class="iconfont iconshare-m"></i>
              <span>{{
                videoDetil.shareCount || videoDetil.shareCount || "分享"
              }}</span>
            </li>
          </ul>
        </div>
        <div class="creator">
          <div class="img_box" @click="toUserDetil">
            <img v-lazy="picUrl" alt="" />
            <p>
              {{ mvDetil.creator.userName || mvDetil.creator }}
            </p>
          </div>
          <div class="follow" :class="followed && 'followed'">
            <span v-if="!followed"><i class="iconfont iconadd"></i> 关注</span>
            <span v-else>已关注</span>
          </div>
        </div>
        <div class="bg"></div>
        <div class="about_video">
          <h5>相关视频</h5>
          <ul>
            <li
              v-for="item in aboutVideo"
              :key="item.vid"
              @click="changeVideo(item)"
            >
              <div class="img_box">
                <img v-lazy="item.coverUrl" alt="" />
                <div class="small_title">
                  <i class="iconfont iconsanjiao"></i>
                  <span class="count">{{ item.playTime | playcount }}</span>
                </div>
              </div>
              <div class="name">
                <p class="mv_name">{{ item.title }}</p>
                <p class="creator_name">
                  {{ item.durationms | durationTime }} by
                  {{ item.creator[0].userName }}
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div class="hot_comment" v-if="hotComments.length">
          <header>
            <h5>精彩评论</h5>
          </header>
          <ul class="comment_list" :class="moreHot && 'remove_border'">
            <li v-for="item in hotComments" :key="item.id">
              <div
                class="img_box"
                @click="
                  $router.push({
                    name: 'user',
                    params: { id: item.user.userId }
                  })
                "
              >
                <img v-lazy="item.user.avatarUrl" alt="" />
              </div>
              <div class="comment_small_box" @click="setOtherUser(item)">
                <header>
                  <div class="user_name">
                    <p class="name">
                      {{ item.user.nickname }}
                      <span
                        v-if="item.user.vipRights"
                        :style="
                          'background-image: url(' +
                            (item.user.vipRights.redVipAnnualCount == 1
                              ? 'https://p1.music.126.net/OeOahPin96CFyHmEnH2grA==/109951163446555771.png'
                              : 'https://p1.music.126.net/y4OeNm5rXOfqWF4f8VuhUw==/109951163703946326.png') +
                            ')'
                        "
                        class="vip"
                      ></span>
                    </p>
                    <p class="time">{{ item.time | timeComment }}</p>
                  </div>
                  <div
                    class="zan"
                    @click.stop="toLike(item.commentId, item.liked)"
                  >
                    <span v-if="item.likedCount">{{ item.likedCount }} </span>
                    <i
                      :class="[
                        'iconfont',
                        item.liked ? 'iconliked' : 'iconzan'
                      ]"
                    ></i>
                  </div>
                </header>
                <p class="container">
                  {{ item.content }}
                </p>
              </div>
            </li>
            <li class="more_component" v-if="moreHot">
              <p>全部精彩评论<i class="iconfont iconyoujiantou"></i></p>
            </li>
          </ul>
        </div>
        <div class="new_comment">
          <header>
            <h5>
              最新评论
              <span class="num">{{ commentCount }}</span>
            </h5>
          </header>
          <ul class="comment_list" :style="!comments.length && 'border: none;'">
            <li v-for="(item, index) in comments" :key="index">
              <div
                class="img_box"
                @click="
                  $router.push({
                    name: 'user',
                    params: { id: item.user.userId }
                  })
                "
              >
                <img v-lazy="item.user.avatarUrl" alt="" />
              </div>
              <div class="comment_small_box" @click="setOtherUser(item)">
                <header>
                  <div class="user_name">
                    <p class="name">
                      {{ item.user.nickname }}
                      <span
                        v-if="item.user.vipRights"
                        :style="
                          'background-image: url(' +
                            (item.user.vipRights.redVipAnnualCount == 1
                              ? 'https://p1.music.126.net/OeOahPin96CFyHmEnH2grA==/109951163446555771.png'
                              : 'https://p1.music.126.net/y4OeNm5rXOfqWF4f8VuhUw==/109951163703946326.png') +
                            ')'
                        "
                        class="vip"
                      ></span>
                    </p>
                    <p class="time">{{ item.time | timeComment }}</p>
                  </div>
                  <div
                    class="zan"
                    @click.stop="toLike(item.commentId, item.liked)"
                  >
                    <span v-if="item.likedCount">{{ item.likedCount }} </span>
                    <i
                      :class="[
                        'iconfont',
                        item.liked ? 'iconliked' : 'iconzan'
                      ]"
                    ></i>
                  </div>
                </header>
                <p class="replay" v-if="item.beReplied.length">
                  {{ item.content }}
                </p>
                <p
                  class="container"
                  :class="item.beReplied.length && 'replay_container'"
                >
                  <span class="replay_user" v-if="item.beReplied.length">{{
                    item.beReplied.length
                      ? "@" + item.beReplied[0].user.nickname
                      : ""
                  }}</span
                  >{{
                    item.beReplied.length
                      ? ": " + (item.beReplied[0].content || "该用户已删除评论")
                      : item.content
                  }}
                </p>
              </div>
            </li>
          </ul>
          <div
            class="no_comment"
            v-if="!comments.length && !hotComments.length"
          >
            <span>暂无评论, 欢迎抢沙发</span>
          </div>
          <Loading v-if="isLoading"></Loading>
        </div>
      </div>
    </div>
    <div class="comment_input">
      <input
        ref="input"
        v-model.trim="message"
        type="text"
        @blur="topFlag = !topFlag"
        @focus="topFlag = !topFlag"
        placeholder="写评论..."
        @keyup.enter="sendMessage"
      />
      <div v-show="topFlag" class="to_top" @click="scroll.scrollTo(0, 0, 500)">
        <i class="iconfont icontotop"></i>
      </div>
      <div v-show="!topFlag" class="num_send">
        <i class="iconfont iconcomment-s"></i>
        <span class="small_count" v-if="commentCount">{{
          commentCount > 999 ? "999+" : commentCount
        }}</span>
        <span
          :class="['send', message.length && 'send_color']"
          @click="sendMessage"
        >
          发送
        </span>
      </div>
    </div>
    <AlertOption
      v-if="aletOptionFlag"
      :otherUserId="otherUserComment.user.userId"
      @toggleAlertOption="toggleAlertOption"
      @removeMessage="removeMessage"
      @readyreplay="readyreplay"
    ></AlertOption>
    <SmallAlert v-if="requestFlag">
      {{ requestMessage }}
    </SmallAlert>
    <Loading v-if="!Object.keys(aboutVideo).length"></Loading>
  </div>
</template>
<script>
import AlertOption from "components/AlertOption";
import TopHeader from "components/TopHeader";
import SmallAlert from "components/SmallAlert";
import VideoLoading from "components/VideoLoading";
import Loading from "components/Loading";
import { mapState } from "vuex";
import { comment } from "common/js/mixin.js";
export default {
  name: "VideoBox",
  data() {
    return {
      startTime: "00:00",
      endTime: "00:00",
      showOptionFlag: false,
      videoPlayFlag: false,
      videoLoadFlag: true,
      videoDetil: {},
      aboutVideo: [],
      followed: false,
      isLoading: false,
      url: "",
      picUrl: "",
      offset: 0,
      hotComments: [],
      comments: [],
      addFlag: false,
      more: false,
      moreHot: false,
      message: "",
      commentCount: null,
      topFlag: true,
      otherUserComment: null,
      aletOptionFlag: false,
      requestFlag: false,
    };
  },
  created() {
    this.getVideoDetil();
    this.getVideoSrc();
    this.getAboutVideo();
    this.getComments();
  },
  components: {
    TopHeader,
    VideoLoading,
    Loading,
    SmallAlert,
    AlertOption
  },
  computed: {
    ...mapState(["mvDetil", "audio"])
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.audio) {
        vm.audio.pause();
      }
    });
  },
  mounted() {
    this.video = this.$refs.video;
    this.topLine = this.$refs.line;
    this.input = this.$refs.input;
    this.botLine = this.topLine.previousElementSibling;
    this.button = this.topLine.nextElementSibling;
    this.$scroll(this, this.$refs.wrapper);
    this.scroll.on("pullingUp", () => {
      this.getOtherComment();
    });
  },
  mixins: [comment],
  methods: {
    toUserDetil() {
      if (this.artist) {
        this.$store.state.singerDetil = {
          picUrl: this.artist.picUrl,
          name: this.artist.name,
          accountId: this.artist.accountId
        };
        this.$store.state.singerId = this.artist.id;
        this.$router.push({
          name: "singer",
          params: { id: this.artist.id }
        });
      } else {
        this.$router.push({
          name: "user",
          params: {
            id: this.mvDetil.creator.userId
          }
        });
      }
    },
    //删除评论
    async removeMessage() {
      this.toggleAlertOption();
      try {
        await this.$getAxios(
          `/comment?t=0&type=${this.mvDetil.comType}&id=${this.mvDetil.vid}&commentId=${this.otherUserComment.commentId}`
        );
        this.requestFun("删除成功");
      } catch {
        this.requestFun("删除失败");
      }
      this.removeUser();
      this.message = "";
    },

    //发送信息+回复
    async sendMessage() {
      if (!this.message) return;
      try {
        await this.$getAxios(
          `/comment?t=${this.otherUserComment ? 2 : 1}&type=${
            this.mvDetil.comType
          }&id=${this.mvDetil.vid}${
            this.otherUserComment
              ? "&commentId=" + this.otherUserComment.commentId
              : ""
          }&content=${this.message}`
        );
        this.requestFun(this.otherUserComment ? "回复成功" : "发表成功");
      } catch {
        this.requestFun(this.otherUserComment ? "回复失败" : "发表失败");
      }
      this.removeUser();
      this.message = "";
      this.input.blur();
    },

    async getOtherComment() {
      this.isLoading = true;
      const { comments, more } = await this.$getAxios(
        `/comment/${this.mvDetil.type}?id=${this.mvDetil.vid}&offset=${this
          .offset * 20}`
      );
      if (comments.length) {
        this.comments = this.comments.concat(comments);
        this.more = more;
        if (this.more) {
          this.offset++;
          this.scroll.finishPullUp();
        }
      }
      this.isLoading = false;
    },

    async getComments() {
      const { hotComments, moreHot, comments, more } = await this.$getAxios(
        `/comment/${this.mvDetil.type}?id=${this.mvDetil.vid}`
      );
      this.hotComments = hotComments;
      this.comments = comments;
      this.addFlag = true;
      this.more = more;
      this.moreHot = moreHot;
      this.offset++;
    },

    async getAboutVideo() {
      const { data } = await this.$getAxios(
        `/related/allvideo?id=${this.mvDetil.vid}`
      );
      this.aboutVideo = data;
    },

    async getVideoDetil() {
      const { data } = await this.$getAxios(
        `/${this.mvDetil.type}/detail?${this.mvDetil.idStr}=${this.mvDetil.vid}`
      );
      if (data.creator) {
        this.followed = data.creator.followed;
        this.picUrl = data.creator.avatarUrl;
      }
      this.commentCount = data.commentCount;
      if (data.artistId) {
        this.getartListLiked(data.artistId);
      }
      this.videoDetil = data;
    },

    async getartListLiked(id) {
      const { artist } = await this.$getAxios("artists?id=" + id);
      this.artist = artist;
      this.followed = artist.followed;
      this.picUrl = artist.img1v1Url;
    },

    async getVideoSrc() {
      const { urls, data } = await this.$getAxios(
        `/${this.mvDetil.type}/url?id=${this.mvDetil.vid}`
      );
      if (urls && urls.length) this.url = urls[0].url;
      else this.url = data.url;
    },

    //更换视频
    changeVideo({ vid, title, playTime, creator }) {
      const flag = /[a-zA-Z]/.test(vid);
      this.$store.state.mvDetil = {
        comType: flag ? 5 : 1,
        type: flag ? "video" : "mv",
        idStr: flag ? "id" : "mvid",
        creator: creator[0],
        playTime,
        title,
        vid
      };
      Object.assign(this.$data, this.$options.data());
      this.getVideoDetil();
      this.getVideoSrc();
      this.getAboutVideo();
      this.getComments();
    },

    //视频结束
    videoEnd() {
      this.stopOrPlay();
      this.noHidenFlag = true;
      this.changeOptionFlag({ clear: true });
      this.topLine.style.width = 0;
      this.button.style.left = 0;
    },
    //操作栏展示
    changeOptionFlag(val) {
      if (this.videoLoadFlag) return;
      this.showOptionFlag = val.clear || !this.showOptionFlag;
      clearTimeout(this.time);
      if (!this.showOptionFlag) return;
      this.time = setTimeout(() => {
        if (this.noHidenFlag) return;
        this.showOptionFlag = false;
      }, 3000);
    },

    //播放 暂停
    stopOrPlay() {
      this.videoPlayFlag = !this.videoPlayFlag;
      if (!this.videoPlayFlag) {
        this.video.pause();
        this.noHidenFlag = true;
      } else {
        this.video.play();
        this.noHidenFlag = null;
        this.changeOptionFlag({ clear: true }); //借用定时器
      }
    },

    //可以播放事件
    startVideo() {
      this.videoPlayFlag = true;
      this.videoLoadFlag = false;
      this.endTime = this.getTime(this.video.duration);
      this.video.play();
    },

    //移动操作
    moveVideo(e) {
      const moveX = e.touches[0].clientX;
      const left = this.botLine.offsetWidth - this.button.offsetWidth;
      const rate = moveX / this.botLine.offsetWidth;
      if (rate < 0 || rate > 1) return;
      this.topLine.style.width = rate * 100 + "%";
      this.video.currentTime = this.video.duration * rate;
      this.noHidenFlag = true;
      this.button.style.left =
        rate * this.botLine.offsetWidth <= left
          ? rate * 100 + "%"
          : left + "px";
    },
    //移动结束
    moveEndVideo() {
      this.noHidenFlag = null;
      this.changeOptionFlag({ clear: true });
    },

    //点击操作
    bounceVideo(e) {
      if (e.target === this.button) return;
      const rate =
        e.offsetX / (this.botLine.offsetWidth + this.button.offsetWidth);
      if (rate < 0 || rate > 1) return;
      this.video.currentTime = this.video.duration * rate;
      this.topLine.style.width = rate * 100 + "%";
      this.button.style.left = rate * 100 + "%";
      this.noHidenFlag = null;
      this.changeOptionFlag({ clear: true });
    },

    //播放事件
    playUpdate() {
      const rate = this.video.currentTime / this.video.duration;
      this.startTime = this.getTime(this.video.currentTime);
      if (rate < 0 || rate > 1) return;
      this.topLine.style.width = rate * 100 + "%";
      if (
        this.button.offsetLeft >
        this.botLine.offsetWidth - this.button.offsetWidth
      )
        return;
      this.button.style.left = rate * 100 + "%";
    },
    getTime(time) {
      //获取 00：00格式的时间
      let minute = Math.floor(time / 60);
      minute = minute >= 10 ? minute : "0" + minute;
      let second = Math.floor(time % 60);
      second = second >= 10 ? second : "0" + second;
      return minute + ":" + second;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.video_bOx {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #fff;
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: opacity 0.3s linear, transform 0.3s linear;
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateY(-100%);
    opacity: 0;
  }
  .down_hidden-enter-active,
  .down_hidden-leave-active {
    transition: opacity 0.3s linear, transform 0.3s linear;
  }
  .down_hidden-enter,
  .down_hidden-leave-to {
    opacity: 0;
    transform: translateY(0.3rem);
  }
  .top_header {
    display: flex;
    background-color: transparent;
    color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    justify-content: space-between;
    .title {
      width: calc(100vw - 0.5rem);
      display: flex;
      span {
        width: 100%;
        @include text-overflow-one;
      }
    }
  }

  .video_container {
    width: 100%;
    position: relative;
    height: 1.8rem;
    background: #000;
    margin-bottom: 0.1rem;
    video {
      width: 100%;
      height: 100%;
      vertical-align: middle;
    }
    .bottom_box {
      width: 100%;
      height: 0.02rem;
      position: absolute;
      left: 0;
      .bottom_line,
      .top_line {
        width: 100%;
        height: 0.02rem;
        position: absolute;
        left: 0;
        top: 0;
        background-color: #ccc;
      }
      .top_line {
        width: 0;
        background-color: $main-background;
      }
      .button {
        width: 0.1rem;
        height: 0.1rem;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background-color: $main-background;
        border-radius: 50%;
        &.hidden_button {
          visibility: hidden;
        }
      }
    }
    .time_box {
      display: flex;
      width: 100%;
      height: 0.25rem;
      box-sizing: border-box;
      padding: 0.05rem 0.15rem;
      justify-content: space-between;
      font-size: $normal-font;
      position: absolute;
      left: 0;
      bottom: 0;
      color: #fff;
      .iconfont {
        font-size: $normal-font;
      }
      .end_time {
        color: $small-white-color;
      }
    }
    .stop_play {
      width: 0.5rem;
      height: 0.5rem;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      line-height: 0.5rem;
      color: $small-white-color;
      .iconfont {
        font-size: 0.3rem;
      }
    }
  }
  .video_cretor {
    height: calc(100vh - 1.8rem);
    overflow: hidden;
    .scroll_box {
      padding-bottom: 1rem;
      .video_message {
        padding: 0 0.1rem;
        font-size: $best-small-font;
        border-bottom: 1px solid #eee;
        h5 {
          font-size: 0.14rem;
          line-height: 0.2rem;
          margin: 0 0 0.05rem 0;
          @include text-overflow-clamp;
        }
        .time_send {
          font-size: $best-small-font;
          color: $noselect-color;
          padding-bottom: 0.1rem;
          p {
            margin: 0;
            line-height: 0.2rem;
            @include text-overflow-clamp;
            -webkit-line-clamp: 3;
          }
        }
        .grounp {
          display: flex;
          width: 100%;
          flex-wrap: wrap;
          li {
            height: 0.15rem;
            line-height: 0.15rem;
            margin: 0 0 0 0.05rem;
            padding: 0.05rem 0.1rem;
            border-radius: 0.1rem;
            color: #686868;
            background-color: #f3f3f3;
          }
          li:first-child {
            color: #b5b5b5;
            margin-left: 0;
            padding-left: 0;
            background-color: #fff;
          }
        }
        .new_class {
          li {
            margin-bottom: 0.1rem !important;
          }
        }
        .iconfont_group {
          padding-bottom: 0.1rem;
          display: flex;
          justify-content: space-around;
          li {
            font-size: $best-small-font;
            text-align: center;
            display: flex;
            flex-direction: column;
            span {
              margin-top: 0.03rem;
              color: $noselect-color;
            }
            .iconfont {
              font-size: 0.2rem;
            }
          }
        }
      }
      .creator {
        padding: 0.1rem;
        display: flex;
        justify-content: space-between;
        font-size: $best-small-font;
        .img_box {
          width: 75%;
          height: 0.4rem;
          border-radius: 50%;
          display: flex;
          img {
            width: 0.4rem;
            height: 100%;
            border-radius: 50%;
            margin-right: 0.1rem;
          }
          p {
            line-height: 0.4rem;
            margin: 0;
            width: 80%;
            @include text-overflow-one;
          }
        }

        .follow {
          color: #fff;
          margin: 0;
          line-height: 0.4rem;
          text-align: center;
          span {
            background: $main-background;
            padding: 0.05rem 0.1rem;
            border-radius: 0.15rem;
            .iconfont {
              font-size: $best-small-font;
            }
          }
        }
        .followed {
          span {
            line-height: 0.4rem;
            padding: 0.05rem 0.11rem;
            background-color: #c2c2c2;
          }
        }
      }
      .bg {
        height: 0.05rem;
        width: 100%;
        background-color: #f5f5f5;
      }
      .about_video {
        padding: 0 0.1rem;
        h5 {
          margin: 0.1rem 0;
          font-size: 0.14rem;
        }
        ul > li {
          @include video_box(1.2rem, 0.675rem);
          margin-bottom: 0.1rem;
          .name {
            width: calc(100% - 1.5rem);
            .mv_name {
              margin-top: 0.09rem;
            }
          }
          .img_box {
            position: relative;
            @include small_count;
          }
        }
      }
      .hot_comment,
      .new_comment {
        padding-left: 0.1rem;
        header {
          h5 {
            margin: 0;
            font-size: $best-small-font;
            font-weight: 800;
          }
          height: 0.3rem;
          line-height: 0.3rem;
        }
        .comment_list {
          border-bottom: 1px solid #eee;
          margin-top: 0.1rem;
          > li {
            display: flex;
            font-size: $best-small-font;
            margin-bottom: 0.1rem;
            padding-right: 0.1rem;
            .img_box {
              width: 0.3rem;
              height: 0.3rem;
              margin-right: 0.1rem;
              position: relative;
              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
            .comment_small_box {
              width: calc(100vw - 0.6rem);
              .container {
                border-bottom: 1px solid #eee;
                padding-bottom: 0.05rem;
                line-height: 0.2rem;
                margin: 0.05rem 0 0 0;
              }
              header {
                display: flex;
                justify-content: space-between;
                height: 0.4rem;
                .user_name {
                  line-height: 0.2rem;

                  p {
                    margin: 0;
                    @include text-overflow-one;
                    width: calc(100vw - 1.2rem);
                  }
                  .name {
                    color: #666666;
                    font-size: $normal-font;
                    .vip {
                      width: 0.3rem;
                      height: 0.1rem;
                      display: inline-block;
                      margin-left: 0.02rem;
                      background-repeat: no-repeat;
                      background-size: contain;
                      background-position: left center;
                    }
                  }
                  .time {
                    color: $nofind-color;
                  }
                }
                .zan {
                  color: $nofind-color;
                  font-size: $best-small-font;
                  line-height: 0.4rem;
                  .iconliked {
                    color: $main-background;
                  }
                }
              }
            }
          }
          li:last-child .container {
            border: none;
          }
          .more_component {
            p {
              font-size: $best-small-font;
              color: $noselect-color;
              margin: 0;
              border: 1px solid $border-color;
              padding: 0.05rem 0.1rem;
              margin: 0 auto;
              border-radius: 0.2rem;
              .iconfont {
                font-size: $best-small-font;
              }
            }
          }
        }
        .remove_border {
          li:nth-last-child(2) .container {
            border: none;
          }
        }
      }
      .new_comment {
        .num {
          font-size: $best-small-font;
          color: $noselect-color;
          font-weight: normal;
        }
        .replay {
          margin: 0.05rem 0 0 0;
          line-height: 0.2rem;
        }
        .replay_container {
          border-left: 2px solid $border-color;
          color: $nofind-color;
          padding-left: 0.05rem;
        }
        .replay_user {
          color: $keyword-color;
        }
        @include loading_box;
        .loading_box {
          top: 0.1rem;
        }
        .no_comment {
          height: 0.3rem;
          margin-top: 0.3rem;
          font-size: $best-small-font;
          line-height: 0.3rem;
          color: $noselect-color;
          text-align: center;
          box-sizing: border-box;
          padding-right: 0.1rem;
        }
      }
    }
  }
  .comment_input {
    border-top: 1px solid #f5f5f5;
    height: 0.4rem;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    justify-content: space-between;
    display: flex;
    font-size: 0.12rem;
    box-sizing: border-box;
    padding: 0 0.1rem;
    background: #fff;
    input {
      width: 80%;
      height: 0.4rem;
      box-sizing: border-box;
      border: none;
      outline: none;
      font-size: 0.13rem;
      &::-webkit-input-placeholder {
        color: #cccccc;
      }
    }
    .num_send {
      text-align: center;
      position: relative;
      color: #808080;
      display: flex;
      .iconcomment-s {
        line-height: 0.4rem;
        font-size: 0.2rem;
        text-align: center;
        margin-right: 0.1rem;
      }
      .small_count {
        position: absolute;
        right: 0.3rem;
        top: 0;
        font-size: 0.12rem;
        transform: scale(0.7);
      }
      .send {
        color: #cccccc;
        font-size: 0.13rem;
        height: 0.4rem;
        line-height: 0.4rem;
      }
      .send_color {
        color: #000;
      }
    }
    .to_top {
      text-align: center;
      line-height: 0.4rem;
      .iconfont {
        font-size: 0.2rem;
      }
    }
  }
}
</style>
