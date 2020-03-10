<template>
  <div class="search_container">
    <TopHeaderSearch
      @changeCmponentId="changeCmponentId"
      :searchComponentId="searchComponentId"
    ></TopHeaderSearch>
    <component
      :is="searchComponentId"
      :searchComponentId="searchComponentId"
      @changeCmponentId="changeCmponentId"
    ></component>
  </div>
</template>

<script>
import TopHeaderSearch from "components/TopHeaderSearch";
import SearchPage from "pages/Search/SearchPage";
import SearchList from "pages/Search/SearchList";
export default {
  name: "SearchDetil",
  components: {
    TopHeaderSearch,
    SearchPage,
    SearchList
  },
  data() {
    return {
      searchComponentId: "SearchPage",
    };
  },
  methods: {
    changeCmponentId() {
      this.searchComponentId =
        this.searchComponentId === "SearchPage" ? "SearchList" : "SearchPage";
    }
  }
};
</script>

<style lang="scss" scoped>
.search_container {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
}
</style>
