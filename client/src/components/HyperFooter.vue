<template>
  <v-footer dark
    padless
  >
    <v-row justify="center" no-gutters>
      <template>
        <div style="position:absolute;right:15px;color:white">
            <v-btn color="white" text @click="ToEN" style="border-right: 1px solid white;border-radius:0px">EN</v-btn>
            <v-divider vertical inset color="white"></v-divider>
            <v-btn color="white" text @click="ToFR">FR</v-btn>
        </div>
      </template>
        <v-btn>{{ new Date().getFullYear() }}  &copy;</v-btn>
    <v-btn text style="position:absolute;left:5px;color:white" >  <strong>Hypertube</strong> </v-btn>
    </v-row>
  </v-footer>
</template>

<script>
import i18n from '../i18n'
import axios from 'axios'

export default {
    data: () => ({
      links: [
                { icon: 'person', text: 'Profile', route: `/profile` },
                { icon: 'home', text: 'Home', route: `/home` },
                { icon: 'settings', text: 'Settings', route: `/settings` },
        ],
    }),
    methods: {
      
        ToEN(){
          if (i18n.locale == 'fr')
          {
            const token = window.localStorage.getItem('token')
            if (token) axios.defaults.headers.common['x-auth-token'] = token
            else delete axios.defaults.headers.common['x-auth-token']

            axios.post("http://localhost:3001/profile/switchLang", {lang: 'en'})
            .then(res => {
              i18n.locale = 'en'
              this.$store.state.userData.lang = 'fr'
              //location.reload()
            })
            .catch(err => {
              this.$router.push({ name: "home" });
            })
          }
        },
        ToFR() {
          if (i18n.locale == 'en')
          {
            const token = window.localStorage.getItem('token')
            if (token) axios.defaults.headers.common['x-auth-token'] = token
            else delete axios.defaults.headers.common['x-auth-token']

            axios.post("http://localhost:3001/profile/switchLang", {lang: 'fr'})
            .then(res => {
              i18n.locale = 'fr'
              this.$store.state.userData.lang = 'fr'
              //location.reload()
            })
            .catch(err => {
              this.$router.push({ name: "home" });
            })
            
          }
        },
    },
  }
</script>
<style>
.v-footer{
  margin-bottom: -30px;
    padding: 6px;
      position: absolute;
    bottom: 0;
    width: 100%;
}
</style>