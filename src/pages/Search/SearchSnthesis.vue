<template>
  <div class="snthesis">
    <div class="interested" v-if="interestedBox">
      <span class="text">你可能感兴趣</span>
      <div
        class="artist"
        v-for="item in artist"
        :key="item.id"
        @click="toSingerDetil(item, false)"
      >
        <div class="img_box">
          <img v-lazy="item.img1v1Url" alt="" />
        </div>
        <div class="name">
          <p class="artist_name">
            歌手:
            {{
              item.name + (item.alias.length ? " (" + item.alias[0] + ")" : "")
            }}
          </p>
          <p class="list_message">
            粉丝:{{ item.fansSize | playcount(true) }} 歌曲:{{
              item.musicSize
            }}
            专辑:{{ item.albumSize }}
          </p>
        </div>
      </div>
      <div
        class="mv_box"
        v-for="(item, index) in mv"
        :key="index"
        @click="startVideo(item)"
      >
        <div class="img_box">
          <img v-lazy="item.cover || item.coverUrl" />
          <i class="iconfont iconfullsanjiao"></i>
        </div>
        <div class="name">
          <p class="mv_name">
            <span v-if="item.id || !/[a-zA-Z]/.test(item.vid)">MV</span>
            视频: {{ item.name || item.title }}
          </p>

          <p class="creator_name">
            {{
              item.artistName ||
                (/[a-zA-Z]/.test(item.vid)
                  ? "by " + item.creator[0].userName
                  : item.creator[0].userName)
            }}
          </p>
        </div>
      </div>
      <div
        class="album_box"
        v-for="item in album"
        :key="item.id"
        @click="toAlbumDetil(item)"
      >
        <div class="img_box">
          <img v-lazy="item.picUrl" alt="" />
        </div>
        <div class="name">
          <p class="artist_name">
            专辑:
            {{
              item.name + (item.alias.length ? " (" + item.alias[0] + ")" : "")
            }}
          </p>
          <p class="list_message">
            {{ item.artists.map(item => item.name).join("/") }}
          </p>
        </div>
      </div>
    </div>
    <div class="song" v-if="songs.length">
      <header>
        <h5 class="left">单曲</h5>
        <div class="right" @click="sendAllSong(songs, true)">
          <i class="iconfont iconbofang"></i>
          <span>播放全部</span>
        </div>
      </header>
      <div class="center">
        <ul>
          <li v-for="item in songs" :key="item.id">
            <div class="name" @click="startMusic(item)">
              <p class="song_name">
                {{ item.name
                }}<i v-if="item.alia.length"> ({{ item.alia[0] }})</i>
              </p>
              <p class="artist_name">
                <i class="small"></i>
                {{
                  item.ar.map(item => item.name).join("/") +
                    " - " +
                    item.al.name
                }}
              </p>
            </div>
            <div class="option">
              <i
                v-if="item.mv"
                class="iconfont iconmv"
                @click="startMv(item)"
              ></i>
              <i class="iconfont iconziyuan"></i>
            </div>
          </li>
        </ul>
      </div>
      <footer class="footer" v-if="moreSong">
        {{ moreSongText }}
        <i class="iconfont iconyoujiantou"></i>
      </footer>
    </div>
    <div class="play_list" v-if="playList.length">
      <header>
        <h5>歌单</h5>
      </header>
      <ul>
        <li v-for="item in playList" :key="item.id" @click="toPlayList(item)">
          <div class="img_box">
            <img v-lazy="item.coverImgUrl" alt="" />
          </div>
          <div class="name">
            <p class="list_name">
              {{ item.name }}
            </p>
            <p class="list_message">
              {{ item.trackCount + "首 by " + item.creator.nickname + ", 播放"
              }}{{ item.playCount | playcount(true) }}次
            </p>
          </div>
        </li>
      </ul>
      <footer class="footer" v-if="morePlayList">
        {{ morePlayListText }}
        <i class="iconfont iconyoujiantou"></i>
      </footer>
    </div>
    <div class="video_list" v-if="videoList.length">
      <header>
        <h5>视频</h5>
      </header>
      <ul>
        <li v-for="item in videoList" :key="item.vid" @click="startVideo(item)">
          <div class="img_box">
            <img v-lazy="item.coverUrl" alt="" />
            <div class="small_title">
              <i class="iconfont iconsanjiao"></i>
              <span class="count">{{ item.playTime | playcount }}</span>
            </div>
          </div>
          <div class="name">
            <p class="mv_name">
              <span v-if="!/[a-zA-Z]/.test(item.vid)">MV</span>
              {{ item.name || item.title }}
            </p>
            <p class="creator_name">
              {{ item.durationms | durationTime }}
              {{
                /[a-zA-Z]/.test(item.vid)
                  ? "by " + item.creator[0].userName
                  : item.creator[0].userName
              }}
            </p>
          </div>
        </li>
      </ul>
      <footer class="footer" v-if="moreVideo">
        {{ moreVideoText }}
        <i class="iconfont iconyoujiantou"></i>
      </footer>
    </div>
    <div class="about_list" v-if="sim_query.length">
      <header>
        <h5>相关搜索</h5>
      </header>
      <ul>
        <li
          v-for="(item, index) in sim_query"
          :key="index"
          @click="changeStateWord(item.keyword)"
        >
          <span>{{ item.keyword }}</span>
        </li>
      </ul>
    </div>
    <div class="mlog_list" v-if="mlogs.length">
      <header>
        <h5>Mlog</h5>
      </header>
      <ul>
        <li v-for="item in mlogs" :key="item.id">
          <div
            class="img_box"
            :style="
              'background-image: url(' +
                item.resource.mlogBaseData.coverUrl +
                ')'
            "
          >
            <span>{{ item.matchFieldContent }}</span>
          </div>
          <div class="bottom">
            <p class="name">{{ item.resource.mlogBaseData.text }}</p>
            <div class="creator">
              <div class="creator_box">
                <img v-lazy="item.resource.userProfile.avatarUrl" alt="" />
                <p>{{ item.resource.userProfile.nickname }}</p>
              </div>
              <p class="good">{{ item.resource.mlogExtVO.likedCount }}赞</p>
            </div>
          </div>
        </li>
      </ul>
      <footer class="footer" v-if="mlogMore">
        {{ mlogMoreText }}
        <i class="iconfont iconyoujiantou"></i>
      </footer>
    </div>
    <div class="talk_list" v-if="talks.length">
      <header>
        <h5>主题</h5>
      </header>
      <ul>
        <li v-for="item in talks" :key="item.talkId">
          <div
            class="img_box"
            :style="'background-image: url(' + item.showCover.url + ')'"
          ></div>
          <div class="name">
            <p class="list_name">#{{ item.talkName }}</p>
            <p class="list_message">
              {{ item.follows }} 人关注 {{ item.participations }}人参与
            </p>
          </div>
        </li>
      </ul>
    </div>
    <div class="singer_list" v-if="allArtist.length">
      <header>
        <h5>歌手</h5>
      </header>
      <ul>
        <li
          v-for="item in allArtist"
          :key="item.id"
          @click="toSingerDetil(item, true)"
        >
          <div class="singer">
            <div class="img_box">
              <img v-lazy="item.img1v1Url" alt="" />
            </div>
            <p class="name">
              {{ item.name
              }}<span v-if="item.alias.length"> ({{ item.alias[0] }})</span>
            </p>
          </div>
          <div class="user_singer" v-if="item.accountId">
            <i class="iconfont iconwo"></i>
            <span>已入驻</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="albums_list" v-if="allAlbums.length">
      <header>
        <h5>专辑</h5>
      </header>
      <ul>
        <li
          v-for="item in allAlbums"
          :key="item.id"
          @click="toAlbumDetil(item)"
        >
          <div class="img_box">
            <img v-lazy="item.blurPicUrl" alt="" />
          </div>
          <div class="name">
            <p class="list_name">
              {{ item.name
              }}<span v-if="item.alias.length"> ({{ item.alias[0] }})</span>
            </p>
            <p class="list_message">
              {{ item.artists.map(item => item.name).join("/") }}
              {{ item.publishTime | saleTime }}
            </p>
          </div>
        </li>
      </ul>
      <footer v-if="albumMore" class="footer">
        {{ albumMoreText }}
        <i class="iconfont iconyoujiantou"></i>
      </footer>
    </div>
    <div class="dj_list" v-if="alldjRadios && alldjRadios.length">
      <header>
        <h5>电台</h5>
      </header>
      <ul>
        <li v-for="item in alldjRadios" :key="item.id">
          <div class="img_box">
            <img v-lazy="item.picUrl" alt="" />
          </div>
          <div class="name">
            <p class="list_name">{{ item.name }}</p>
            <p class="list_message">{{ item.dj.nickname }}</p>
          </div>
        </li>
      </ul>
      <footer v-if="djRadioMore" class="footer">
        {{ djRadioMoreText }}
        <i class="iconfont iconyoujiantou"></i>
      </footer>
    </div>
    <div class="user_list" v-if="allusers.length">
      <header>
        <h5>用户</h5>
      </header>
      <ul>
        <li v-for="item in allusers" :key="item.userId">
          <div
            class="left_box"
            @click="$router.push({ name: 'user', params: { id: item.userId } })"
          >
            <div class="img_box">
              <img v-lazy="item.avatarUrl" alt="" />
              <div
                class="user_type"
                v-if="item.userType"
                :class="[
                  item.userType === 2 && 'super_singer',
                  item.userType === 4 && 'super_song',
                  item.userType === 200 && 'super_user'
                ]"
              ></div>
            </div>
            <div class="name">
              <p class="list_name">
                {{ item.nickname
                }}<i
                  :class="[
                    'iconfont',
                    [item.gender > 1 ? 'icongirl' : 'iconnan']
                  ]"
                ></i>
              </p>
              <p class="list_message">{{ item.signature }}</p>
            </div>
          </div>
          <div class="foloow">
            <p v-if="!item.followed" class="no_follow">
              <i class="iconfont iconadd"></i>
              关注
            </p>
            <p class="foloowed" v-else>
              <i class="iconfont iconfollow"></i>
              已关注
            </p>
          </div>
        </li>
      </ul>
      <footer v-if="userMore" class="footer">
        {{ userMoreText }}
        <i class="iconfont iconyoujiantou"></i>
      </footer>
    </div>
    <div class="not_find" v-if="showNotFind">
      未找到与"{{ word }}"相关的内容
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      showNotFind: false,
      interestedBox: false,
      artist: [],
      mv: [],
      album: [],
      moreSong: false,
      songs: [],
      moreSongText: "",
      morePlayList: false,
      morePlayListText: "",
      playList: [],
      moreVideo: false,
      moreVideoText: "",
      videoList: [],
      sim_query: [],
      mlogMore: false,
      mlogMoreText: "",
      mlogs: [],
      talks: [],
      allArtist: [],
      albumMore: false,
      albumMoreText: "",
      allAlbums: [],
      djRadioMore: false,
      djRadioMoreText: "",
      alldjRadios: [],
      userMore: false,
      userMoreText: "",
      allusers: []
    };
  },
  created() {
    this.getInterestedList();
  },
  watch: {
    word() {
      if (!this.word) return;
      this.getInterestedList();
    }
  },
  computed: {
    ...mapState(["word", "songId", "songList"])
  },
  methods: {
    ...mapMutations({
      changeWord: "SEARCH_WORD",
      sendSongList: "SEND_ALLSONGS",
      setPlayList: "SET_PLAYLIST"
    }),
    ...mapActions(["getAudioSrcList", "checkSong"]),
    sendAllSong(list, flag) {
      this.sendSongList({
        songList: JSON.parse(JSON.stringify(list)),
        _flag: flag
      });
      this.getAudioSrcList();
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
    startMv({ mv, name, ar }) {
      this.$store.state.mvDetil = {
        comType: 1,
        type: "mv",
        idStr: "mvid",
        creator: { userName: ar[0].name },
        title: name,
        vid: mv
      };
      this.$router.push("/home/video");
    },
    startVideo({ vid, title, playTime, artistName, creator, id }) {
      const flag = /[a-zA-Z]/.test(vid || id);
      this.$store.state.mvDetil = {
        comType: flag ? 5 : 1,
        type: flag ? "video" : "mv",
        idStr: flag ? "id" : "mvid",
        creator: artistName || creator[0],
        playTime,
        title,
        vid: vid || id
      };
      this.$router.push("/home/video");
    },
    toPlayList(detil) {
      this.setPlayList(detil);
      this.$router.push({ name: "songlist", params: { id: detil.id } });
    },
    async toSingerDetil({ fansSize, picUrl, name, accountId, id }, flag) {
      let checkSingerArtlist = {artist: {accountId: null}}
      if (!flag) {
        checkSingerArtlist = await this.$getAxios("/artists?id=" + id);
        this.$store.state.checkSingerArtlist = checkSingerArtlist;
      }
      this.$store.state.singerDetil = {
        picUrl,
        name,
        accountId: accountId || checkSingerArtlist.artist.accountId,
        fansSize
      };
      this.$store.state.singerId = id;
      this.$router.push({ name: "singer", params: { id } });
    },
    startMusic(songObj) {
      if (this.songId === songObj.id) {
        this.$store.state.audioBoxFlag = true;
        return;
      }
      if (this.songList.length) {
        const index = this.songList.findIndex(item => item.id === songObj.id);
        if (index > -1) return this.checkSong(index);
      }
      if (!this.songId) this.$store.state.audioBoxFlag = true;
      this.sendAllSong([songObj], false);
    },
    changeStateWord(word) {
      this.changeWord(word);
    },
    async getInterestedList() {
      this.showNotFind = false;
      Object.assign(this.$data, this.$options.data());
      this.$emit("initPullUp");
      this.$emit("startLoading", true);
      const { result } = await this.$getAxios(
        "/search/multimatch?keywords=" + this.word
      );
      if (!result || !Object.keys(result).length) {
        this.getAllData();
        return;
      }
      this.$emit("startLoading", false);
      if (result.artist && result.artist.length) {
        this.interestedBox = true;
        this.artist = result.artist;
        // this.artist = result.artist;
      }
      if (result.mv && result.mv.length) {
        this.interestedBox = true;
        this.mv = result.mv;
      }
      if (result.album && result.album.length) {
        this.interestedBox = true;
        this.album = result.album;
      }
      this.getAllData();
    },
    async getAllData() {
      const { result } = await this.$getAxios(
        `/search?keywords=${this.word}&type=1018`
      );
      if (!result) {
        this.showNotFind = true;
        this.$emit("startLoading", false);
        return;
      }
      this.$emit("startLoading", false);
      if (result.video && !this.mv.length && !this.album.length) {
        this.mv = result.video.videos.slice(0, 1);
      }
      if (result.song) {
        this.moreSong = result.song.more;
        this.moreSongText = result.song.moreText;
        this.songs = result.song.songs;
      }
      if (result.playList) {
        this.morePlayList = result.playList.more;
        this.morePlayListText = result.playList.moreText;
        this.playList = result.playList.playLists;
      }
      if (result.video) {
        this.moreVideo = result.video.more;
        this.moreVideoText = result.video.moreText;
        this.videoList = result.video.videos;
      }
      if (result.sim_query) {
        this.sim_query = result.sim_query.sim_querys;
      }
      if (result.mlog) {
        this.mlogMore = result.mlog.more;
        this.mlogMoreText = result.mlog.moreText;
        this.mlogs = result.mlog.mlogs;
      }
      if (result.talk && Object.keys(result.talk).length) {
        this.talks = result.talk.talks;
      }
      if (result.artist) {
        this.allArtist = result.artist.artists;
      }
      if (result.album) {
        this.albumMore = result.album.more;
        this.albumMoreText = result.album.moreText;
        this.allAlbums = result.album.albums;
      }
      if (result.djRadio) {
        this.djRadioMore = result.djRadio.more;
        this.djRadioMoreText = result.djRadio.moreText;
        this.alldjRadios = result.djRadio.djRadios;
      }
      if (result.user) {
        this.userMore = result.user.more;
        this.userMoreText = result.user.moreText;
        this.allusers = result.user.users;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.snthesis {
  padding-top: 0.1rem;
  .interested {
    font-size: $normal-font;
    margin-bottom: 0.2rem;
    .text {
      display: block;
      color: #666666;
      margin-bottom: 0.1rem;
      font-size: $best-small-font;
    }
    .artist {
      @include small_artlist_box(0.5rem, 50%);
      @include play_list(0.08rem);
    }
    .album_box {
      margin-top: 0.1rem;
      @include small_artlist_box(0.5rem, 0.03rem);
      @include play_list(0.1rem);
      .img_box {
        position: relative;
        margin-right: 0.15rem;
        &::after {
          content: "";
          position: absolute;
          top: 0.02rem;
          right: -0.1rem;
          width: 0.1rem;
          height: 0.46rem;
          background-repeat: no-repeat;
          background-size: 1.66rem 0.97rem;
          background-image: url(~common/images/screen.png);
          background-position: 0 -0.3rem;
        }
      }
      .name {
        width: calc(100vw - 0.85rem);
      }
    }
    .mv_box {
      margin-top: 0.1rem;
      @include video_box(1rem, 0.5625rem);
      .name {
        width: calc(100% - 1.1rem);
      }

      .img_box {
        .iconfont {
          display: block;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          color: $font-color;
        }
      }
    }
  }
  .song {
    header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      h5 {
        margin: 0;
        font-size: $best-big-font;
        line-height: 0.26rem;
      }
      .right {
        font-size: $best-small-font;
        padding: 0.06rem;
        border-radius: 0.15rem;
        border: 1px solid #eee;
        .iconfont {
          font-size: $best-small-font;
          margin-right: 0.05rem;
        }
      }
    }
    .center {
      > ul > li {
        @include song_list;
        .small {
          width: 0.12rem;
          height: 0.08rem;
          display: inline-block;
          background: url(~common/images/index_icon_2x.png) no-repeat;
          background-size: 166px 97px;
        }
      }
    }
    @include search_footer;
  }
  .play_list {
    @include search_header;

    @include search_footer;
    ul > li {
      margin-top: 0.1rem;
      .name {
        width: calc(100vw - 1rem);
      }
      @include small_artlist_box(0.7rem, 0.05rem);

      @include play_list;
    }
  }
  .video_list {
    @include search_header;
    ul > li {
      margin-top: 0.1rem;
      @include video_box(1.2rem, 0.675rem);
      .name {
        width: calc(100% - 1.5rem);
        .mv_name {
          margin: 0.1rem 0;
        }
      }
    }
    @include search_footer;
    .img_box {
      position: relative;
      @include small_count;
    }
  }
  .about_list {
    @include search_header;
    ul {
      > li {
        margin-top: 0.1rem;
        height: 0.3rem;
        padding: 0 0.08rem;
        display: inline-block;
        margin-left: 0.1rem;
        border-radius: 0.1rem;
        line-height: 0.3rem;
        background-color: #f3f3f3;
        font-size: 0.12rem;
      }
      li:first-child {
        margin-left: 0;
      }
    }
  }
  .mlog_list {
    @include search_header;
    @include search_footer;
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 0.1rem;
      li {
        border-radius: 0.08rem;
        overflow: hidden;
        height: 2.1rem;
        box-shadow: -0.02rem 0.03rem 0.1rem rgba(0, 0, 0, 0.3);
        margin-bottom: 0.1rem;
        width: 1.45rem;
        .img_box {
          position: relative;
          span {
            position: absolute;
            color: #fff;
            left: 0.1rem;
            bottom: 0.1rem;
            width: 90%;
            font-size: $best-small-font;
            @include text-overflow-one;
          }
          width: 1.45rem;
          height: 1.45rem;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
        .bottom {
          box-sizing: border-box;
          padding: 0.05rem;
          .name {
            margin: 0;
            font-size: $normal-font;
            @include text-overflow-clamp;
          }
          .creator {
            display: flex;
            font-size: $best-small-font;
            justify-content: space-between;
            line-height: 0.2rem;
            box-sizing: border-box;
            padding-top: 0.05rem;
            color: $noselect-color;
            .good {
              margin: 0;
            }
            .creator_box {
              display: flex;
              p {
                margin: 0;
                width: 0.7rem;
                @include text-overflow-one;
              }
              img {
                width: 0.2rem;
                height: 0.2rem;
                line-height: 0.2rem;
                border-radius: 50%;
                vertical-align: middle;
                margin-right: 0.05rem;
              }
            }
          }
        }
      }
    }
  }
  .talk_list {
    @include search_header;
    ul {
      margin-top: 0.1rem;
      > li {
        display: flex;
        .img_box {
          margin-right: 0.1rem;
          width: 0.7rem;
          height: 0.7rem;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          border-radius: 0.05rem;
        }
        margin-bottom: 0.1rem;
        .name {
          width: calc(100vw - 1rem);
        }
        @include play_list;
      }
    }
  }
  .singer_list {
    @include search_header;
    ul {
      margin-top: 0.1rem;
      > li {
        justify-content: space-between;
        @include small_artlist_box(0.7rem, 50%);
        margin-bottom: 0.1rem;
        .singer {
          display: flex;
          p {
            width: calc(100vw - 1.7rem);
            @include text-overflow-one;
            line-height: 0.7rem;
            margin: 0;
            font-size: $normal-font;
            span {
              color: $noselect-color;
            }
          }
        }
        .user_singer {
          font-size: $best-small-font;
          box-sizing: border-box;
          transform: scale(0.8);
          .iconfont {
            font-size: $best-small-font;
            margin-right: 0.05rem;
            display: inline-block;
            width: 0.2rem;
            line-height: 0.2rem;
            text-align: center;
            height: 0.2rem;
            border-radius: 50%;
            background: $main-background;
            color: #fff;
          }
          span {
            line-height: 0.7rem;
            color: $nofind-color;
          }
        }
      }
    }
  }
  .albums_list {
    @include search_header;
    @include search_footer;
    ul > li {
      margin-top: 0.1rem;
      @include small_artlist_box(0.7rem, 0.05rem);
      @include play_list;
      .img_box {
        position: relative;
        margin-right: 0.15rem;
        &::after {
          content: "";
          position: absolute;
          position: absolute;
          top: -0.2rem;
          right: -0.1rem;
          width: 0.1rem;
          height: 0.9rem;
          background-repeat: no-repeat;
          background-size: 2.22rem 1.57rem;
          background-image: url(~common/images/screen.png);
          background-position: 0 -0.3rem;
        }
      }
      .name {
        width: calc(100vw - 1.1rem);
        .list_name {
          span {
            color: $noselect-color;
          }
        }
      }
    }
  }
  .dj_list {
    @include search_header;
    @include search_footer;
    ul > li {
      margin-top: 0.1rem;
      @include small_artlist_box(0.7rem, 0.05rem);
      @include play_list;
      .name {
        width: calc(100vw - 1rem);
        .list_name {
          span {
            color: $noselect-color;
          }
        }
      }
    }
  }
  .user_list {
    @include search_header;
    @include search_footer;
    ul > li {
      justify-content: space-between;
      margin-top: 0.1rem;
      @include small_artlist_box(0.7rem, 50%);
      @include play_list;
      .left_box {
        display: flex;
      }
      .img_box {
        position: relative;
        .user_type {
          width: 0.2rem;
          height: 0.2rem;
          background-repeat: no-repeat;
          position: absolute;
          right: 0;
          bottom: 0;
          border-radius: 50%;
        }
        .super_singer {
          background-position: -0.02rem -0.02rem;
          background-image: url("~common/images/usericn_2x.png");
        }
        .super_song {
          background-position: -0.42rem -0.02rem;
          background-image: url("~common/images/usericn_2x.png");
        }
        .super_user {
          background-position: -0.82rem -0.02rem;
          background-image: url("~common/images/usericn_2x.png");
        }
      }
      .name {
        width: calc(100vw - 1.7rem);
        .list_name {
          span {
            color: $noselect-color;
          }
          .iconfont {
            margin-left: 0.05rem;
          }
          .icongirl {
            color: #f38cb5;
          }
          .iconnan {
            color: #6fcdff;
          }
        }
      }
      .foloow {
        margin-top: 0.25rem;
        p {
          transform: scale(0.8);
          margin: 0;
          border: 1px solid $main-background;
          color: $main-background;
          font-size: $best-small-font;
          border-radius: 0.1rem;
          .iconfont {
            font-size: $best-small-font;
          }
        }
        .no_follow {
          padding: 0.04rem 0.08rem;
        }
        .foloowed {
          padding: 0.04rem 0.05rem;
          border: 1px solid $noselect-color;
          color: $noselect-color;
        }
      }
    }
  }
  @include not_find;
}
</style>
