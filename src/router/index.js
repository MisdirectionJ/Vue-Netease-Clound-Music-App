import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import Home from "pages/Home/Home";
import MobileLogin from "pages/Login/MobileLogin";
export default new VueRouter({
  linkActiveClass: "active-class",
  routes: [
    { path: "/", redirect: "/home/find" },
    { path: "/home", redirect: "/home/find" },
    { path: "/login", component: MobileLogin },
    {
      path: "/home",
      component: Home,

      children: [
        {
          path: "find",
          component: r =>
            require.ensure(
              [],
              () => r(require("pages/Home/HomeFind")),
              "HomeFind"
            )
        },
        {
          path: "cloud",
          component: r =>
            require.ensure(
              [],
              () => r(require("pages/Home/HomeCloud")),
              "HomeCloud"
            )
        },
        {
          path: "me",
          component: r =>
            require.ensure([], () => r(require("pages/Home/HomeMe")), "HomeMe")
        },
        {
          path: "search",
          components: {
            search: r =>
              require.ensure(
                [],
                () => r(require("pages/Search/SearchDetil")),
                "SearchDetil"
              )
          }
        },
        {
          path: "songlist/:id",
          name: "songlist",
          components: {
            list: r =>
              require.ensure(
                [],
                () => r(require("components/SongList")),
                "SongList"
              )
          }
        },
        {
          path: "singer/:id",
          name: "singer",
          components: {
            list: r =>
              require.ensure(
                [],
                () => r(require("pages/Singer/SingerDetil")),
                "SingerDetil"
              )
          }
        },
        {
          path: "comment",
          components: {
            search: r =>
              require.ensure(
                [],
                () => r(require("components/CommentsBox")),
                "CommentsBox"
              )
          }
        },
        {
          path: "video",
          components: {
            search: r =>
              require.ensure(
                [],
                () => r(require("components/VideoBox")),
                "VideoBox"
              )
          }
        },
        {
          path: "singerlist",
          components: {
            search: r =>
              require.ensure(
                [],
                () => r(require("pages/Singer/SingerList")),
                "SingerList"
              )
          }
        },
        {
          path: "top",
          components: {
            search: r =>
              require.ensure(
                [],
                () => r(require("components/TopList")),
                "TopList"
              )
          }
        },
        {
          path: "topsinger",
          components: {
            search: r =>
              require.ensure(
                [],
                () => r(require("components/TopSinger")),
                "TopSinger"
              )
          }
        },
        {
          path: "cloudsong",
          components: {
            search: r =>
              require.ensure(
                [],
                () => r(require("components/CloudSong")),
                "CloudSong"
              )
          }
        },
        {
          path: "commend",
          components: {
            search: r =>
              require.ensure(
                [],
                () => r(require("components/CommendList")),
                "CommendList"
              )
          },
          meta: 'needLogin'
        },
        {
          path: "user/:id",
          name: "user",
          components: {
            list: r =>
              require.ensure(
                [],
                () => r(require("pages/User/UserDetil")),
                "UserDetil"
              )
          }
        },
        {
          path: "album/:id",
          name: "album",
          components: {
            list: r =>
              require.ensure(
                [],
                () => r(require("components/AlbumDetil")),
                "AlbumDetil"
              )
          }
        },
        {
          path: "dj",
          components: {
            search: r =>
              require.ensure(
                [],
                () => r(require("pages/DiscJockey/DiscMain")),
                "DiscMain"
              )
          }
        }
      ]
    }
  ],
});
