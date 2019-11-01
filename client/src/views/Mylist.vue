<template>
    <v-layout class="justify-content-center containers fill-height fluid grid-list-xl ">
        <div class="container ">
        <v-row v-if="this.empty > 0" class="col-lg-9 col-md-8  col-sm-12 col-12">
        <v-card
        v-for="(movie,index) in posterList"
        :key="index"
        :loading="loading"
        class="card-content cards card card-right col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12"
        >
            <v-img class="card-img-top" v-if="movie.poster" :src="movie.poster"></v-img>
            <div class="card-content-overlay"></div>

        <v-card-title>{{movie.title}}</v-card-title>
        <v-card-title v-if="movie.type === 'tv'">{{movie.name}}</v-card-title>
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
            </v-row>
            <div class="content-details fadeIn-bottom">
            <div class="description">{{ movie.plot.substring(0, 370) }}</div>
            <div class="my-4 subtitle-1 description">{{movie.year}}</div>
            <v-card-actions>
                <v-btn class="watch" @click="dataShare(movie)" outlined>
                <v-icon>play_arrow</v-icon>
                <span class="fa fa-play"></span>Watch
                </v-btn>
                <v-btn class="watch" @click="addMovie(movie.imdbid)" outlined>
                <v-icon>remove</v-icon>
                <span class="fa fa-play"></span>List
                </v-btn>
            </v-card-actions>
            </div>
        </v-card-text>
        </v-card>
    </v-row>
    <v-row class="justify-content-center" style="margin-top: 100px;" v-else>
        <v-btn to="/home" style="background-color: transparent;">
            <v-icon color="white">home</v-icon>
            <span class="white--text mt-1 ml-1">Empty List</span>
        </v-btn>
    </v-row>
    </div>
  </v-layout>

</template>

<script>
import Axios from 'axios'

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
    data() {
        return {
            empty: 0,
            loading: false,
            list: [],
            posterList: [],
            swiperOption: {
                slidesPerView: 3,
                spaceBetween: 30,
                pagination: {
                el: ".swiper-pagination",
                clickable: true
                }
            },
        }
    },
    methods: {
        init()
        {
            const token = window.localStorage.getItem("token");
            if (token) Axios.defaults.headers.common["x-auth-token"] = token;
            else delete Axios.defaults.headers.common["x-auth-token"];

            Axios.post("http://localhost:3001/video/getMyList")
            .then(res => {
                
                this.list = res.data.msg;
                this.empty = this.list.length
                this.list.forEach(element => {
                Axios.post("http://localhost:3001/video/search/getimg", {
                imdb_id: element.movie_id
                })
                .then(resp => {
                    this.posterList.push(resp.data);
                })
                .catch(err => {
                    this.$router.push({ name: "home" });
                });
            });
        })
        .catch(err => {
            this.$router.push({ name: "home" });
        });
        },
        addMovie(movie_id)
        {
            const token = window.localStorage.getItem("token");
            if (token) Axios.defaults.headers.common["x-auth-token"] = token;
            else delete Axios.defaults.headers.common["x-auth-token"];

            this.posterList = this.posterList.filter(el => el.imdbid != movie_id)
            Axios.post("http://localhost:3001/video/removeMovie", {movie_id: movie_id})
            .then(res => {
                this.empty--;
            })
            .catch(err => {
               this.$router.push({ name: "home" });
            })
        },
         dataShare(movie) {
            this.$router.push({
                path: `/video/${movie.imdbid}`,
                params: { hash: "test" }
            })
        },
        checkList(movieId) {
            let found = false;
            this.list.forEach(element => {
                if (element.movie_id === movieId) found = true;
            });
            return found;
        },
        emptyList()
        {
            return (this.list.length)
        }
    },
    computed: {
        
       
    }
}
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
.name {
  font-family: "Orbitron";
}

.v-list{
 background: rgba(0, 0, 0, 0.7) !important;
}

.card{
 border: none !important;
 min-width: 250px !important;
}
.card-content{
  background: rgba(0, 0, 0, 0.7) !important;
}
.v-card__title{
 color: #fff !important;
}
.cards{
 max-height: 700px !important;
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
.card-content{
  overflow: hidden;
}
</style>