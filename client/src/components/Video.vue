<template>
   <div class="containers fill-height fluid grid-list-xl">
  <div   class="body-content">
  <v-layout v-if="loader == true">
      <v-progress-circular
        class="mx-auto my-3"
        :size="60"
        :width="7"
        color="blue lighten-2"
        v-show="loader"
        indeterminate
      ></v-progress-circular>
    </v-layout>

    <v-layout v-else>
        <div  class="container">
        <div class="wrapper"  v-if="data"  :style="{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6) 0%,rgba(0,0,0,0.6) 100%), url(${bgImg})` }">
          <div class="row bg animated fadeInDown">
            <div class="medium-5 column">
              <h1 class="titl">{{data.name}}</h1>
              <span class="sub-left">
                {{data.genres}}
                <v-rating
                  color="amber"
                  :value="data.rating / 2"
                  half-increments
                  dense
                  style="display:inline-block"
                  class="pl-0"
                  size="14"
                  readonly
                ></v-rating>
                {{data.rating}}
              </span>
              <span class="sub-left">
                <b>{{ $t("Video.prody") }}</b>
                {{data.year}}
              </span>
              <span class="sub-left">
                <b>{{ $t("Video.dur") }}</b>
                : {{data.runtime}}
              </span>
              <span v-if="data.production != 'N/A'" class="sub-left">
                <b>{{ $t("Video.prod") }}</b>
                {{data.production}}
              </span>
              <span class="sub-left">
                <b>{{ $t("Video.direct") }}</b>
                {{data.director}}
              </span>
              <span class="sub-left">
                <b>{{ $t("Video.write") }}</b>
                {{data.writer}}
              </span>
              <span class="sub-left">
                <b>{{ $t("Video.stars") }}</b>
                {{data.actors}}
              </span>
              <div class="break"></div>

              <p class="content">{{data.plot}}</p>
            </div>
            <!-- Change this part -->
            <div class="row">
              <div class="medium-7 column text-right col-lg-6 col-md-6 col-sm-12 col-12">
                <h3 class="text-center">
                  Yts
                  <a
                    @click="listHashes = listHashes ? null : listHashes2;"
                    class="btn btn-success"
                  >Show</a>
                </h3>
                <div class="button  btn-wrap text-center" v-for="(Hash,index) in listHashes" :key="index">
                  <span class="fa fa-play"></span>
                  <a @click="streamVideo(Hash)">Watch - {{ Hash.type }} - {{ Hash.quality }}</a>
                </div>
              </div>
              <div class="medium-7 column text-right col-lg-6 col-md-12 col-sm-12 col-12">
                <h3 class="text-center">
                  Extra Torrents
                  <a
                    @click="otherHashes = otherHashes ? null : otherHashes2;"
                    class="btn btn-success"
                  >Show</a>
                </h3>
                <div class="button btn-wrap text-center" v-for="(Hash,index) in otherHashes" :key="index">
                  <span class="fa fa-play"></span>
                  <a @click="streamVideo_extraT(Hash)">{{ Hash.name.substring(0,  26) }} - {{ Hash.size }}</a>
                </div>
              </div>
            </div>
            <!-- ////// END /////// -->
          </div>
        </div>
      </div>
    </v-layout>
  </div>
   </div>
</template>

<script>
import axios from "axios";
import i18n from '../i18n'

export default {
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
  name: "Video",
  data: () => ({
    id: "",
    data: null,
    bgImg: "",
    listHashes: null,
    listHashes2: null,
    otherHashes: null,
    otherHashes2: null,
    loader: false
  }),

  methods: {
    init()
    {
      this.loader = true;
      this.id = this.$route.params.id;

      const token = window.localStorage.getItem("token");
      if (token) axios.defaults.headers.common["x-auth-token"] = token;
      else delete axios.defaults.headers.common["x-auth-token"];

      axios
        .post("http://localhost:3001/video/search/getimg", { imdb_id: this.id })
        .then(resp => {
          this.data = resp.data;
          if (resp.data == "ERROR") this.$router.push({ name: "home" });
          delete axios.defaults.headers.common["x-auth-token"];
          axios.get("https://api.themoviedb.org/3/find/" + this.id + "?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&language=en-US&external_source=imdb_id")
            .then(resp2 => {
              if (resp2.data.movie_results[0])
              {
                this.bgImg ="http://image.tmdb.org/t/p/w1280" + resp2.data.movie_results[0].poster_path;
              }
            });
        })
        .catch(err => {
          this.$router.push({path: `/home`});
        });
      delete axios.defaults.headers.common["x-auth-token"];
      axios
        .get(
          "https://yts.unblocked4u.net/api/v2/list_movies.json?query_term=" +
            this.id
        )
        .then(resp => {
          this.listHashes2 = resp.data.data.movies[0].torrents;
        })
        .catch(err => {
        });
      // add
      axios.defaults.headers.common["x-auth-token"] = token;
      axios.post("http://localhost:3001/video/extraApi", { imdb_id: this.id })
        .then(resp => {
          this.otherHashes2 = resp.data.slice(0, 5);
          this.loader = false;
        })
        .catch(err => {
        });
    },
    streamVideo(Hash) {
      this.$router.push({
        path: `/stream/${this.id}/${Hash.hash}`,
        params: { hash: "test" }
      });
    },
    streamVideo_extraT(Hash) {
      var hash_link = Hash.magnetLink.slice(20, 60);
      this.$router.push({
        path: `/stream/${this.id}/${hash_link}`,
        params: { hash: "test" }
      });
    }
  }
};
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Maven+Pro");
@import url("https://fonts.googleapis.com/css?family=Orbitron");

.body-content {
  background-position: center;
  background-repeat: repeat;
  background-size: cover;
}
.wrapper {
   background-size: cover;
}
.bg {
  position: relative;
  top: 6%;
  transform: translateY(-10%);
  background-repeat: no-repeat;
  background-position: center-center;
  background-size: cover;
  height: auto;
  padding: 2.5em;
  filter: saturate(1) blur(0.35px);
  /* z-index: 5; */
  transition: all 500ms ease-in-out;
}
.titl {
  font-family: "Orbitron";
  font-size: 2.75em;
  margin-top: 100px;
}
.sub {
  font-family: "Orbitron";
  position: relative;
}
.sub-right {
  float: right;
  position: relative;
  right: 0.5em;
}
.break {
  margin: 2% 0 2% 0;
  height: 1px;
  width: 100%;
  background: #e2e3e6;
}
.content {
  margin: 0 0 20% 0;
}
.button-holder {
  position: relative;
  top: 30vh;
  left: 20vh;
}
.fa-play {
  margin-right: 0.75em;
}

.button {
  background: #e2494b;
  font-family: Maven Pro;
  font-weight: 300;
  text-transform: uppercase;
  border-radius: 3px;
  transition: all 300ms ease-in-out;
  padding: 10px 12px 15px 0px !important;
  top: 10em;
  color: #ffffff;
  margin: 0 0 1.25rem;
}
.button:hover,
.button:focus {
  background: #cc3b3b;
}
h1,
h2,
h3,
h4,
h5,
h6,
p,
.sub-left,
.sub-right {
  color: #e2e3e6;
  font-family: Maven Pro;
}
.sub-left,
.sub-right {
  font-family: Orbitron;
  font-size: 0.9em;
  position: relative;
  top: -0.5em;
}
.sub-left b {
  font-weight: bold;
}
.button a {
  color: #fff !important;
  text-decoration: none;
}
.medium-7 {
  padding-top: 14px;
}
p,
.sub-left,
.sub-right {
  line-height: 35px;
  font-weight: 300;
  letter-spacing: 1px;
  display: table-row-group;
}
.mid .row {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 0;
  margin-bottom: 0;
  max-width: 60rem;
}

.cont {
  margin: 0 auto;
  top: 11%;
  right: 23%;
  left: 23%;
  position: absolute;
  background-size: cover;
  box-shadow: 0px 1px 39px 7px black;
  background-position: left;
}
@media only screen and (max-width: 40.063em) {
  .cont {
    top: 0;
    right: 0;
    left: 0;
    position: relative;
  }
}

@media only screen and (min-width: 40.063em) {
  .column,
  .columns {
    position: relative;
    padding-left: 0.9375rem;
    padding-right: 0.9375rem;
    float: left;
  }
}

[class*="column"] + [class*="column"]:last-child {
  float: right;
}
.text-right {
  text-align: right !important;
}


.containers{
  background-image: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%,rgba(0,0,0,0.6) 100%), url('../../public/886533.jpg');
  background-size: cover;
}
.btn-wrap{
  word-wrap: break-word;
  width: 100%;
  overflow: hidden;
}
</style>
