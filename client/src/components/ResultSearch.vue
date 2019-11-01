<template>
  <v-row>
    <v-card
      v-for="(movie,index) in data"
      :key="index"
      :loading="loading"
      class="card-content card card-right col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12"
    >
      <v-img class="card-img-top" v-if="movie.large_cover_image" :src="movie.large_cover_image"></v-img>
      <v-img class="card-img-top" v-else :src="defImage"></v-img>
      <div class="card-content-overlay"></div>

      <v-card-title>{{movie.title}}</v-card-title>
      <!-- <v-card-title v-if="movie.media_type === 'tv'">{{movie.name}}</v-card-title> -->
      <v-card-text class="card-body">
        <v-row align="center">
          <v-rating
            :value="movie.rating / 2"
            color="amber"
            half-increments
            dense
            class="pl-3"
            size="14"
            readonly
          ></v-rating>

          <div class="grey--text pl-2">{{movie.rating}}</div>
          <v-icon class="grey--text pl-2" v-if="checkMovie(movie.imdb_code)">mdi-eye-check</v-icon>
        </v-row>
        <div class="content-details fadeIn-bottom">
          <div class="description">{{ movie.description_full.substring(0, 370) }}</div>
          <div class="my-4 subtitle-1 description">{{movie.year}}</div>
          <v-card-actions v-if="actions">
            <v-btn class="watch" @click="dataShare(movie)" outlined>
              <v-icon>play_arrow</v-icon>
              <span class="fa fa-play"></span>Watch
            </v-btn>
            <v-btn class="watch" @click="addMovie(movie.imdb_code)" outlined>
              <v-icon v-if="checkList(movie.imdb_code)">remove</v-icon>
              <v-icon v-else>add</v-icon>
              <span class="fa fa-play"></span>List
            </v-btn>
          </v-card-actions>
        </div>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
import axios from "axios";
export default {
  name: "ResultSearch",
  props: {
    data: Array,
    pStart: Number,
    pEnd: Number
  },
  data() {
    return {
      loading: false,
      actions: true,
      defImage: "https://www.tellerreport.com/images/no-image.png",
      listWatched: [],
      list: [],
      watched: 0,
      total: 0,
      offset: 0,
      items: [],
      nextItem: 0
    };
  },
  mounted() {
      if (this.$store.getters.status == 'auth')
          this.init();
      else
      {
          this.$store.watch(
          (state, getters) => getters.status,
          (newValue, oldValue) => {
          if (newValue == 'auth')
              this.init();
          })
      }
  },
  methods: {
    init()
    {
      const token = window.localStorage.getItem("token");
      if (token) axios.defaults.headers.common["x-auth-token"] = token;
      else delete axios.defaults.headers.common["x-auth-token"];
      this.reserve();
      axios
        .post("http://localhost:3001/video/getMyList")
        .then(res => {
          this.list = res.data.msg;
        })
        .catch(err => {
          console.log(err);
        });
      axios.post("http://localhost:3001/video/getListWatched").then(res => {
        this.listWatched = res.data;
      });
    },
    addMovie(movie_id) {
      const token = window.localStorage.getItem("token");
      if (token) axios.defaults.headers.common["x-auth-token"] = token;
      else delete axios.defaults.headers.common["x-auth-token"];

      if (this.checkList(movie_id)) {
        this.list = this.list.filter(el => el.movie_id != movie_id);
        axios
          .post("http://localhost:3001/video/removeMovie", {
            movie_id: movie_id
          })
          .then(res => {})
          .catch(err => {
            console.log(err);
          });
      } else {
        this.list.push({ movie_id: movie_id });
        axios
          .post("http://localhost:3001/video/addMovie", { movie_id: movie_id })
          .then(res => {})
          .catch(err => {
            console.log(err);
          });
      }
    },
    reserve() {
      this.loading = true;

      setTimeout(() => (this.loading = false), 1000);
    },
    dataShare(movie) {
      //:href="'/video/' + movie.imdb_code"
      this.$router.push({
        path: `/video/${movie.imdb_code}`,
        params: { hash: "test" }
      });
      // this.$store.dispatch("dataShare", movie)
    },
    checkList(movieId) {
      let found = false;
      this.list.forEach(element => {
        if (element.movie_id === movieId) found = true;
      });
      return found;
    },
    checkMovie(movieId) {
      let found = false;
      this.listWatched.forEach(element => {
        if (element.movie_id === movieId) found = true;
      });
      return found;
    }
  }
};
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Orbitron");
.card-right {
  width: 300px;
  float: left;
}
@media only screen and (max-width: 800px) {
  .card {
    width: 100% !important;
  }
  .div-left {
    padding-left: 0;
  }
}
.rela {
  position: relative;
}
.name {
  font-family: "Orbitron";
}

.v-list {
  background: rgba(0, 0, 0, 0.7) !important;
}

.card {
  border: none !important;
}
.card-content {
  background: rgba(0, 0, 0, 0.7) !important;
}
.v-card__title {
  color: #fff !important;
}

.card-content .card-content-overlay {
  background: rgba(0, 0, 0, 0.7);
  position: absolute;
  height: 99%;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  -webkit-transition: all 0.4s ease-in-out 0s;
  -moz-transition: all 0.4s ease-in-out 0s;
  transition: all 0.4s ease-in-out 0s;
}
.card-content:hover .card-content-overlay {
  opacity: 1;
}
.content-details {
  position: absolute;
  text-align: center;
  padding-left: 1em;
  padding-right: 1em;
  width: 100%;
  top: 50%;
  left: 50%;
  opacity: 0;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-transition: all 0.3s ease-in-out 0s;
  -moz-transition: all 0.3s ease-in-out 0s;
  transition: all 0.3s ease-in-out 0s;
}
.card-content:hover .content-details {
  top: 50%;
  left: 50%;
  opacity: 1;
}
.fadeIn-bottom {
  top: 80%;
}

.fadeIn-top {
  top: 20%;
}

.fadeIn-left {
  left: 20%;
}

.fadeIn-right {
  left: 80%;
}
.description {
  color: white;
  text-align: justify;
  text-justify: inter-word;
}
.image {
  position: relative;
}
.watch {
  color: #fff !important;
  margin: 0 auto;
}
.card-content {
  overflow: hidden;
}
</style>