<template>
  <div class="containers fill-height fluid grid-list-xl">
    <v-container>
      <section class="col-sm-12 pt-3 px-0">
        <b-form inline class="d-flex justify-content-center">
          <div class="col-md-6 col-8 pl-0">
            <b-input
              v-if="cardLang == 'fr'"
              class="w-100 mr-sm-2"
              type="text"
              :placeholder="this.fr"
              v-model="inputData"
              @input="signalChange"
            />
            <b-input
              v-else
              class="w-100 mr-sm-2"
              type="text"
              :placeholder="this.en"
              v-model="inputData"
              @input="signalChange"
            />
          </div>
        </b-form>
      </section>
      <v-row no-gutters v-if="dataMovie">
        <div class="div-left col-lg-3 col-md-4 col-sm-12 col-12">
          <v-card class="card">
            <v-list rounded>
              <v-subheader>Filtre</v-subheader>
              <v-card-text>
                <v-row>
                  <v-col class="pr-4 pt-0">
                    <p style="color:black">{{ $t("Home.rating") }}</p>
                    <v-slider
                      v-model="slider"
                      @input="signalChange"
                      class="align-center"
                      :max="10"
                      :min="0"
                      hide-details
                    >
                      <template v-slot:append>
                        <v-text-field
                          disabled
                          class="mt-0 pt-0 align-center"
                          v-model="slider"
                          hide-details
                          single-line
                          type="number"
                          style="width: 60px"
                        ></v-text-field>
                      </template>
                    </v-slider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="pr-4 pt-0">
                    <p style="color:black">{{ $t("Home.year") }}</p>
                    <v-slider
                      v-model="slider2"
                      @input="load_data"
                      class="align-center"
                      :max="get_year"
                      :min="1900"
                      hide-details
                    >
                      <template v-slot:append>
                        <v-text-field
                          disabled
                          class="mt-0 pt-0 align-center"
                          v-model="slider2"
                          hide-details
                          single-line
                          type="number"
                          style="width: 60px"
                        ></v-text-field>
                      </template>
                    </v-slider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="pr-4 pt-0">
                    <p style="color:black">Genre :</p>
                    <v-col class="d-flex" cols="12">
                      <v-select
                        v-model="selected_val"
                        @change="signalChange"
                        :items="genre_list"
                        :item-text="cardLang"
                        label="Standard"
                        item-value="value"
                      ></v-select>
                    </v-col>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-list>
          </v-card>
        </div>
        <div class="div-right col-lg-9 col-md-8 col-sm-12 col-12">
          <ResultSearch
            :data="dataMovie"
            :page="1"
            :pStart="p_start"
            :pEnd="p_end"
            class="Content"
            id="result"
          />
        </div>
        <div class="circle-loader" v-if="loadingScroll"></div>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import ResultSearch from "./ResultSearch";
import i18n from "../i18n";

const sortJsonArray = require("sort-json-array");

export default {
  name: "SearchVue",
  components: {
    ResultSearch
  },
  data() {
    return {
      en: "Enter Movie Name",
      fr: "Entrez le nom du film",
      item: 0,
      selection: 1,
      items: [{ text: "Movies", count: 0 }, { text: "Tv Show", count: 0 }],
      inputData: "",
      dataMovie_all: [],
      popularMovies: null,
      dataMovie: [],
      dataTv: null,
      baseUrl: "",
      imageSize: "",
      imageUrl: "",
      nbr_p_movies: 0,
      nbr_p_tv: 0,
      page_tmp: 1,
      loadingScroll: false,
      p_start: 0,
      p_end: 8,
      page: 1,
      get_year: new Date().getFullYear() + 1,
      slider: 0,
      slider2: 0,
      genre_list: [
        { value: "Standard", en: "Standard", fr: "Standard" },
        { value: "Action", en: "Action", fr: "Action" },
        { value: "Adventure", en: "Adventure", fr: "Aventure" },
        { value: "Animation", en: "Animation", fr: "Animation" },
        { value: "Biography", en: "Biography", fr: "Biographie" },
        { value: "Comedy", en: "Comedy", fr: "Comédie" },
        { value: "Crime", en: "Crime", fr: "Criminalité" },
        { value: "Documentary", en: "Documentary", fr: "Criminalité" },
        { value: "Drama", en: "Drama", fr: "Drame" },
        { value: "Family", en: "Family", fr: "Famille" },
        { value: "Fantasy", en: "Fantasy", fr: "Fantaisie" },
        { value: "Film Noir", en: "Dark movie", fr: "Film Noir" },
        { value: "History", en: "History", fr: "Histoire" },
        { value: "Horror", en: "Horror", fr: "Horreur" },
        { value: "Music", en: "Music", fr: "Musique" },
        { value: "Mystery", en: "Mystery", fr: "Mystére" },
        { value: "Musical", en: "Musical", fr: "Musicale" },
        { value: "Romance", en: "Romance", fr: "Romance" },
        { value: "Sci-Fi", en: "Sci-Fi", fr: "Science-fiction" },
        { value: "Short Film", en: "Short Film", fr: "Court métrage" },
        { value: "Sport", en: "Sport", fr: "Sport" },
        { value: "Superhero", en: "Superhero", fr: "Super héros" },
        { value: "Thriller", en: "Thriller", fr: "Thriller" },
        { value: "War", en: "War", fr: "Guerre" },
        { value: "Western", en: "Western", fr: "Occidentale" }
      ],
      selected_val: ""
    };
  },
  mounted() {
    if (this.$store.getters.status == "auth") this.init();
    else {
      this.$store.watch(
        (state, getters) => getters.status,
        (newValue, oldValue) => {
          if (newValue == "auth") this.init();
        }
      );
    }
  },
  methods: {
    init() {
      this.getPopulerMovie();
      this.loadingscroll = false;
      const el = document.getElementById("result");
      el.addEventListener("scroll", e => {
        if (el.scrollHeight - el.scrollTop === el.clientHeight) {
          this.loadingScroll = true;
          setTimeout(e => {
            this.page++;
            if (this.inputData.trim() != "") {
              this.searchData();
            } else {
              this.getPopulerMovie();
            }
            this.loadingScroll = false;
          }, 2000);
        }
      });
    },
    searchData() {
      delete axios.defaults.headers.common["x-auth-token"];
      axios
        .get(
          "https://yts.unblocked4u.net/api/v2/list_movies.json?query_term=" +
            this.inputData +
            "&page=" +
            this.page +
            "&minimum_rating=" +
            this.slider +
            "&genre=" +
            this.selected_val
        )
        .then(res => {
          if (res.data.data.movie_count > 0) {
            sortJsonArray(res.data.data.movies, "title").forEach(element => {
              this.dataMovie.push(element);
            });
            this.dataMovie_all = this.dataMovie;
            this.items[0].count = this.dataMovie.length;
            this.nbr_p_movies = Math.ceil(this.dataMovie.length / 8);
          } else {
            this.dataMovie = [];
            this.items[0].count = 0;
            this.nbr_p_movies = 0;
          }
        });
    },
    signalChange: function() {
      this.page = 1;
      this.dataMovie = [];
      if (this.selected_val === "Standard") this.selected_val = "";
      if (this.inputData.trim() != "") {
        this.searchData();
      } else {
        this.getPopulerMovie();
      }
    },
    load_data: function() {
      var Movie_tmp = null;
      Movie_tmp = this.dataMovie_all;
      if (Movie_tmp) {
        Movie_tmp = Movie_tmp.filter(word => {
          if (word.year >= this.slider2) {
            return true;
          } else return false;
        });
        this.dataMovie = Movie_tmp;
      }
    },
    getPopulerMovie() {
      delete axios.defaults.headers.common["x-auth-token"];
      axios
        .get(
          "https://yts.unblocked4u.net/api/v2/list_movies.json?sort_by=download_count&order_by=desc&page=" +
            this.page +
            "&minimum_rating=" +
            this.slider +
            "&genre=" +
            this.selected_val
        )
        .then(res => {
          this.popularMovies = res.data.data.movies;
          sortJsonArray(this.popularMovies, "title").forEach(element => {
            this.dataMovie.push(element);
          });
          this.dataMovie_all = this.dataMovie;
        });
    }
  },
  computed: {
    cardLang() {
      return i18n.locale;
    }
  }
};
</script>
<style>
.container {
  max-width: 1700px !important;
}
.card {
  /* margin-right: 5px; */
  margin-top: 20px;
  transform: perspective(800px);
  transform-style: preserve-3d;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.7) !important;
  max-height: 545px !important;
}
.circle-loader {
  position: absolute;
  top: 93%;
  left: 63%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top: 5px solid rgb(255, 255, 255);
  animation: animate 1.5s infinite linear;
}
@keyframes animate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
.card * {
  color: white !important;
}
.Content {
  height: 1200px;
  overflow: auto;
}
.v-menu__content * {
  color: white !important;
}

.div-left {
  float: left;
  padding-left: 10px;
}
.div-right {
  float: right;
  padding-left: 40px !important;
}
.text-center {
  margin-top: 8px;
}
/* @media (min-width: 601px){
 .div-left {
    width: 26.33333%;
}
}
@media (min-width: 601px){
 .div-right {
    width: 66.66666%;
}
} */
/* @media only screen and (max-width: 1132px) {
  .card {
    width: 80% !important;
  }
  .div-left{
    padding-left: 0
  }
} */
@media only screen and (max-width: 768px) {
  .div-right {
    padding-left: 0 !important;
  }
}
</style>
