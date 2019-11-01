<template>
  <div>
    <v-toolbar short>
      <v-toolbar-title class="toolbar">
         <v-btn @click="ToHome" class="title font-weight-light" text>
          <v-icon >local_movies</v-icon>
          <span class="grey--text">HYPER</span>
            <span>TUBE</span>
          </v-btn>
      </v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-toolbar-items>
        <v-btn v-if="this.$route.name === 'signup' || this.$route.name === 'forgot'" @click="ToLogin" text>{{ $t('Login.login') }}</v-btn>
        <v-btn v-if="this.$route.name === 'login'" @click="ToSignup" text>{{ $t('Login.new') }}</v-btn>
        <v-divider vertical inset></v-divider>
        <v-btn text @click="ToEN">EN</v-btn>
        <v-divider vertical inset></v-divider>
        <v-btn text @click="ToFR">FR</v-btn>
      </v-toolbar-items>

    </v-toolbar>
  </div>
</template>

<script>
import i18n from '../i18n'

export default {
    data() {
        return {
            
        }
    },
    methods: {
      ToEN(){
        if (i18n.locale == 'fr')
        {
          if (this.$route.name == 'home_page')
              this.$router.push({path: `/en`})
          else
            this.$router.push({path: `/en/${this.$route.name}`})
          i18n.locale = 'en';
        }
      },
      ToFR() {
        if (i18n.locale == 'en')
        {
          if (this.$route.name == 'home_page')
              this.$router.push({path: `/fr`})
          else
              this.$router.push({path: `/fr/${this.$route.name}`})
          i18n.locale = 'fr'
        }
      },
      ToHome() {
       this.$router.push({path: `/${i18n.locale}`})
      },
      ToSignup() {
        this.$router.push({path: `/${i18n.locale}/signup`})
      },
      ToLogin() {
        this.$router.push({path: `/${i18n.locale}/login`})
      }
    }
}
</script>
<style>
.toolbar{
   text-decoration:none;
     background:#fff;
     font-family: 'Orbitron';
     font-size: 20px !important;
     font-weight: bold
}
</style>