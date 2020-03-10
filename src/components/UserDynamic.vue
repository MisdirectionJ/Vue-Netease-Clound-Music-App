<template>
  <div class="dynamic_box">
    <ul>
      <li v-for="item in events" :key="item.id">
        <div class="img_box">
          <img v-lazy="profile.avatarUrl" alt="" />
        </div>
        <div class="detil">
          <div v-if="item.json.album">
            <p class="cretor">
              <span>{{ profile.nickname }}</span> 分享专辑:
            </p>
            <p class="time">{{ item.eventTime | timeComment }}</p>
            <p>{{ item.json.msg }}</p>
            <img
              class="user_img"
              v-if="item.pics.length"
              v-lazy="item.pics[0].originUrl"
              alt=""
            />
            <div class="main_detil" @click="toAlbumDetil(item.json.album)">
              <div class="img_box">
                <img v-lazy="item.json.album.img80x80" alt="" />
              </div>
              <div class="name">
                <p>{{ item.json.album.name }}</p>
                <p class="list_message">
                  {{ item.json.album.artist.name }}
                </p>
              </div>
            </div>
          </div>
          <div v-else-if="item.json.song">
            <p class="cretor">
              <span>{{ profile.nickname }}</span> 分享单曲:
            </p>
            <p class="time">{{ item.eventTime | timeComment }}</p>
            <p>{{ item.json.msg }}</p>
            <img
              class="user_img"
              v-if="item.pics.length"
              v-lazy="item.pics[0].originUrl"
              alt=""
            />
            <div class="main_detil" @click="toStartMusic(item.json.song)">
              <div class="img_box">
                <img v-lazy="item.json.song.album.img80x80" alt="" />
                <div class="small_box">
                  <i class="iconfont iconfullsanjiao"></i>
                </div>
              </div>
              <div class="name">
                <p>
                  {{ item.json.song.name
                  }}{{ item.json.song.alias ? item.json.song.alias[0] : "" }}
                </p>
                <p class="list_message">
                  {{ item.json.song.artists.map(item => item.name).join("/") }}
                </p>
              </div>
            </div>
          </div>
          <div v-else-if="item.json.video">
            <p class="cretor">
              <span>{{ profile.nickname }}</span> 分享视频:
            </p>
            <p class="time">{{ item.eventTime | timeComment }}</p>
            <p>{{ item.json.msg }}</p>
            <img
              class="user_img"
              v-if="item.pics.length"
              v-lazy="item.pics[0].originUrl"
              alt=""
            />
            <div class="video_box" @click="toStartVideo(item.json.video)">
              <img v-lazy="item.json.video.coverUrl" alt="" />
              <div class="cover">
                <i class="iconfont iconfullsanjiao"></i>
                <div class="bottom">
                  <span
                    ><i class="iconfont iconsanjiao"></i
                    >{{ item.json.video.playTime | playcount }}</span
                  >
                  <span
                    ><i class="iconfont icontop"></i
                    >{{ item.json.video.duration | initTime }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="item.json.mv">
            <p class="cretor">
              <span>{{ profile.nickname }}</span> 分享视频:
            </p>
            <p class="time">{{ item.eventTime | timeComment }}</p>
            <p>{{ item.json.msg }}</p>
            <img
              class="user_img"
              v-if="item.pics.length"
              v-lazy="item.pics[0].originUrl"
              alt=""
            />
            <div class="video_box" @click="toStartVideo(item.json.mv)">
              <img v-lazy="item.json.mv.imgurl16v9" alt="" />
              <div class="cover">
                <div class="top">
                  <p>
                    <span class="small_tit">MV</span> {{ item.json.mv.name }}
                  </p>
                  <p>
                    {{ item.json.mv.artists.map(item => item.name).join("/") }}
                  </p>
                </div>
                <i class="iconfont iconfullsanjiao"></i>
                <div class="bottom">
                  <span
                    ><i class="iconfont iconsanjiao"></i
                    >{{ item.json.mv.playCount || playcount }}</span
                  >
                  <span
                    ><i class="iconfont icontop"></i
                    >{{ (item.json.mv.duration / 1000) | initTime }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="item.json.playlist">
            <p class="cretor">
              <span>{{ profile.nickname }}</span> 分享歌单:
            </p>
            <p class="time">{{ item.eventTime | timeComment }}</p>
            <p>{{ item.json.msg }}</p>
            <img
              class="user_img"
              v-if="item.pics.length"
              v-lazy="item.pics[0].originUrl"
              alt=""
            />
            <div class="main_detil" @click="toPlayList(item.json.playlist)">
              <div class="img_box">
                <img v-lazy="item.json.playlist.coverImgUrl" alt="" />
              </div>
              <div class="name">
                <p>
                  <span class="small_tit">歌单</span>
                  {{ item.json.playlist.name }}
                </p>
                <p class="list_message">
                  by {{ item.json.playlist.creator.nickname }}
                </p>
              </div>
            </div>
          </div>
          <div v-else-if="item.json.resource">
            <p class="cretor">
              <span>{{ profile.nickname }}</span> 分享评论:
            </p>
            <p class="time">{{ item.eventTime | timeComment }}</p>
            <p>{{ item.json.msg }}</p>
            <div class="resource_detil" v-if="item.json.resource.user">
              <div>
                <p>
                  <span class="hight_light"
                    >@{{ item.json.resource.user.nickname }}:</span
                  >{{ item.json.resource.content }}
                </p>
                <div class="song_box">
                  <img
                    v-lazy="
                      JSON.parse(item.json.resource.resourceInfo).album.img80x80
                    "
                    alt=""
                  />
                  <p>{{ item.json.resource.resourceName }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="item.json.topic">
            <p class="cretor">
              <span>{{ profile.nickname }}</span> 分享专栏:
            </p>
            <p class="time">{{ item.eventTime | timeComment }}</p>
            <p>{{ item.json.msg }}</p>
            <div class="topic_detil">
              <div class="message">
                <p>
                  <span class="small_tit">专栏</span>
                  {{ item.json.topic.title }}
                </p>
                <p class="creator">by {{ item.json.topic.creator.nickname }}</p>
              </div>
              <div
                class="topic_box"
                :style="
                  'background-image: url(' + item.json.topic.coverUrl + ')'
                "
              ></div>
            </div>
          </div>
          <div v-else>
            <p class="cretor">
              <span>{{ profile.nickname }}</span>
            </p>
            <p class="time">{{ item.eventTime | timeComment }}</p>
            <p>{{ item.json.msg }}</p>
            <img
              class="user_img"
              v-if="item.pics.length"
              v-lazy="item.pics[0].originUrl"
              alt=""
            />
          </div>
          <div class="option">
            <div>
              <span><i class="iconfont iconxunhuan"></i>{{item.info.shareCount || '转发'}}</span>
              <span><i class="iconfont iconcomment"></i>{{item.info.commentCount || '评论'}}</span>
              <span><i class="iconfont iconzan"></i>{{item.info.likedCount || '赞'}}</span>
            </div>
            <i
              v-if="userId === id"
              class="iconfont iconziyuan"
              @click="showRemoveAlert(item.id)"
            ></i>
          </div>
        </div>
      </li>
    </ul>
    <p class="not_find" v-if="noHave">暂时还没有动态哦</p>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  created() {
    this.getDynamic();
  },

  data() {
    return {
      events: [],
      noHave: false,
      id: null,
    };
  },

  props: {
    profile: Object
  },
  watch: {
    removeDynamicFlag(val) {
      if (val) this.removeEvent();
    }
  },
  computed: {
    ...mapState(["songId", "songList", "userId", "removeDynamicFlag"])
  },
  activated() {
    if (this.id === this.profile.userId) return;
    Object.assign(this.$data, this.$options.data());
    this.getDynamic();
  },
  filters: {
    initTime(time) {
      let minute = Math.floor(time / 60);
      minute = minute >= 10 ? minute : "0" + minute;
      let second = Math.floor(time % 60);
      second = second >= 10 ? second : "0" + second;
      return minute + ":" + second;
    }
  },
  methods: {
    ...mapActions(["getAudioSrcList", "getOneAudio", "checkSong"]),
    ...mapMutations({
      sendSong: "SEND_ALLSONGS",
      hiddenAlert: "SETREMOVE_ALERT_FLAG"
    }),
    showRemoveAlert(id) {
      this.removeId = id;
      this.$store.state.removeAlertMessage = {
        title: "确定要删除此动态",
        remove: "删除",
        flag: "removeDynamicFlag"
      };
      this.$store.state.fullRemoveFlag = true;
    },
    async removeEvent() {
      this.hiddenAlert({ el: "removeDynamicFlag", flag: false });
      await this.$getAxios("/event/del?evId=" + this.removeId);
    },

    async getDynamic() {
      this.id = this.profile.userId;
      this.$emit("changeLoading", true);
      const { events } = await this.$getAxios("user/event?uid=" + this.id);
      this.$emit("changeLoading", false);
      if (!events.length) return (this.noHave = true);
      this.events = events.map(item => {
        return {
          id: item.id,
          json: JSON.parse(item.json),
          eventTime: item.eventTime,
          pics: item.pics,
          info: item.info
        };
      });
    },
    toAlbumDetil({ id, name, picUrl, publishTime, artists, size }) {
      this.$store.state.albumDetil = {
        id,
        name,
        picUrl,
        publishTime,
        size,
        artlistName: artists[0].name
      };
      this.$router.push({ name: "album", params: { id } });
    },
    toPlayList(detil) {
      this.$store.state.playListDetil = detil;
      this.$router.push({ name: "songlist", params: { id: detil.id } });
    },
    toStartMusic(songObj) {
      songObj.ar = songObj.artists;
      songObj.al = songObj.album;
      this.$store.state.audioBoxFlag = true;
      if (this.songId === songObj.id) return;
      if (this.songList.length) {
        const index = this.songList.findIndex(item => item.id === songObj.id);
        if (index > -1) return this.checkSong(index);
        this.$store.state.songList.splice(
          this.songIndex + 1,
          0,
          JSON.parse(JSON.stringify(songObj))
        );
        this.getOneAudio({
          id: songObj.id,
          _index: this.songIndex + 1,
          _flag: true
        });
        return;
      }
      this.sendSong({
        songList: JSON.parse(JSON.stringify([songObj])),
        _flag: true
      });
      this.getAudioSrcList();
    },
    toStartVideo({ videoId, title, playTime, artistName, creator, id, name }) {
      const flag = /[a-zA-Z]/.test(videoId || id);
      this.$store.state.mvDetil = {
        comType: flag ? 5 : 1,
        type: flag ? "video" : "mv",
        idStr: flag ? "id" : "mvid",
        creator: artistName || {
          userName: creator.nickname,
          userId: creator.userId
        },
        playTime,
        title: title || name,
        vid: videoId || id
      };
      this.$router.push("/home/video");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.dynamic_box {
  ul {
    margin-top: 0.1rem;
    > li {
      border-bottom: 1px solid $border-color;
      padding: 0.1rem;
      @include small_artlist_box(0.3rem, 50%);
      .detil {
        width: calc(100vw - 0.6rem);
        p {
          margin: 0;
          line-height: 0.2rem;
          font-size: $normal-font;
        }
        .cretor {
          span {
            color: $keyword-color;
          }
        }
        .time {
          color: $noselect-color;
          font-size: $best-small-font;
        }
        .video_box {
          width: 100%;
          position: relative;
          img {
            width: 100%;
            height: 100%;
          }
          .cover {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            background-color: rgba(0, 0, 0, 0.3);
            top: 0;
            .iconfullsanjiao {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              font-size: 0.25rem;
              color: rgba(255, 255, 255, 0.5);
            }
            .bottom {
              width: 100%;
              box-sizing: border-box;
              line-height: 0.2rem;
              position: absolute;
              left: 0;
              font-size: $best-small-font;
              bottom: 0.05rem;
              color: #fff;
              display: flex;
              padding: 0 0.1rem;
              justify-content: space-between;
              .iconfont {
                font-size: $best-small-font;
                margin-right: 0.03rem;
              }
            }
            .top {
              position: absolute;
              width: 100%;
              left: 0;
              color: #fff;
              box-sizing: border-box;
              padding: 0 0.1rem;
              top: 0;
              line-height: 0.2rem;
              p {
                margin: 0;
              }
              .small_tit {
                border: 1px solid #fff;
                display: inline-block;
                transform: scale(0.8);
                padding: 0 0.03rem;
              }
            }
          }
        }
        .main_detil {
          width: 100%;
          box-sizing: border-box;
          padding: 0.05rem;
          background-color: #f3f3f3;
          @include small_artlist_box(0.4rem, 0.03rem);
          @include play_list(0.03rem);
          .name {
            width: 80%;
          }
          .small_tit {
            color: $main-background;
            border: 1px solid $main-background;
            display: inline-block;
            transform: scale(0.8);
            padding: 0 0.02rem;
          }

          .img_box {
            position: relative;
            .small_box {
              position: absolute;
              left: 50%;
              top: 50%;
              margin-left: -0.1rem;
              margin-top: -0.1rem;
              width: 0.2rem;
              height: 0.2rem;
              background-color: rgba(255, 255, 255, 0.9);
              border-radius: 50%;
              line-height: 0.2rem;
              .iconfont {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-40%, -50%);
                color: $main-background;
                font-size: $best-small-font;
              }
            }
          }
        }
        .topic_detil {
          width: 100%;
          box-sizing: border-box;
          padding: 0.05rem;
          display: flex;
          background-color: #f3f3f3;
          justify-content: space-between;
          .topic_box {
            width: 1.2rem;
            background-size: cover;
            margin-left: 0.1rem;
            background-repeat: no-repeat;
            border-radius: 0.03rem;
          }
          .message {
            width: calc(100% - 1.2rem);
            p {
              font-size: 0.13rem;
              .small_tit {
                color: $main-background;
                border: 1px solid $main-background;
                display: inline-block;
                transform: scale(0.8);
                padding: 0 0.02rem;
              }
            }
            .creator {
              font-size: 0.12rem;
              color: #808080;
            }
          }
        }
        .resource_detil {
          border: 1px solid #eaeaea;
          box-sizing: border-box;
          padding: 0.1rem;
          .hight_light {
            color: $keyword-color;
          }
          .song_box {
            display: flex;
            img {
              width: 0.3rem;
              height: 0.3rem;
              border-radius: 0.03rem;
              margin: 0.1rem 0.05rem 0 0;
            }
            p {
              width: 80%;
              margin: 0;
              line-height: 0.5rem;
              @include text-overflow-one;
              font-size: 0.12rem;
              color: #808080;
            }
          }
        }
        .option {
          margin-top: 0.1rem;
          display: flex;
          justify-content: space-between;
          span {
            margin-right: 0.2rem;
            font-size: $best-small-font;
            color: $noselect-color;
            .iconfont {
              color: $nofind-color;
              margin-right: 0.05rem;
            }
          }
          .iconfont {
            color: #808080;
          }
        }
        .user_img {
          width: 1.5rem;
          margin: 0.02rem 0;
        }
      }
    }
  }
  @include not_find;
}
</style>
