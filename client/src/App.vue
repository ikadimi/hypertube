<template>
    <v-app>
      <Hyperbar v-if="this.$route.name !== 'login' && this.$route.name !== 'ExtLogin' && this.$route.name !== 'signup' && this.$route.name !== 'forgot'  && this.$route.name !== 'home_page' && this.$route.name !== 'resset'"/>
      <navbar v-else-if="this.$route.name !== 'ExtLogin'"/>
      <router-view />
      <HypFooter v-if="this.$route.name !== 'login' && this.$route.name !== 'ExtLogin' && this.$route.name !== 'signup' && this.$route.name !== 'forgot'  && this.$route.name !== 'home_page'"/>
    </v-app>
</template>

<script>
import Navbar from './components/Navbar'
import Hyperbar from './components/HyperBar'
import HypFooter from './components/HyperFooter'

export default {
  name: 'App',
  components: {
    HypFooter,
    Navbar,
    Hyperbar
  },
  data: () => ({
    //
  }),
};
</script>
<style>
a{
  text-decoration: none !important
}
</style>

