<template>

        <!-- Full Page Intro -->
        <div class="view">
          <!-- Mask & flexbox options-->
          <div class="mask rgba-container d-flex justify-content-center align-items-center">
            <!-- Content -->
            <div class="container">
              <!--Grid row-->
              <div class="row">
                <!--Grid column-->
                <div class="col-md-6 white-text text-center text-md-left mt-xl-5 mb-5 wow fadeInLeft" data-wow-delay="0.3s">
                  <h1 class="h1-responsive font-weight-bold mt-sm-5"> {{ $t('Landing.title') }} </h1>
                  <hr class="hr-light">
                  <h6 class="mb-4"> {{ $t('Landing.title_2') }}
                    </h6>
                    <v-btn @click="ToSignup" large class="mr-2 font-weight-light ">{{ $t('Landing.signup') }}</v-btn>
                    <v-btn @click="ToLogin" large outlined color="white">{{ $t('Landing.login') }}</v-btn>
                </div>
                <!--Grid column-->
                <!--Grid column-->
                <!--Grid column-->
              </div>
              <!--Grid row-->
            </div>
            <!-- Content -->
          </div>
          <!-- Mask & flexbox options-->
              <main>
        <div class="container">
          <!--Grid row-->
          <div class="row py-5">
            <!--Grid column-->
            <div class="col-md-12 text-center">
              <p><strong>2019 &copy; Hypertube | 1337 </strong> </p>
            </div>
            <!--Grid column-->
          </div>
          <!--Grid row-->
        </div>
      </main>
        </div>
        <!-- Full Page Intro -->
        
</template>
<script>
import i18n from '../i18n'

export default {
    methods: {
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
    /* Required for full background image */

.view {
  height: 100%;
}

@media (max-width: 740px) {

  .view {
    height: 100%;
  }
}
@media (min-width: 800px) and (max-width: 850px) {
 
  .view {
    height: 100%;
  }
}

.btn .fa {
  margin-left: 3px;
}

.top-nav-collapse {
  background-color: #424f95 !important;
}

.navbar:not(.top-nav-collapse) {
  background: transparent !important;
}

@media (max-width: 991px) {
  .navbar:not(.top-nav-collapse) {
    background: #424f95 !important;
  }
}

.btn-white {
  color: black !important;
}

h6 {
  line-height: 1.7;
}

.rgba-container {
  background: -webkit-linear-gradient(45deg, rgba(42, 27, 161, 0.7), rgba(29, 210, 177, 0.7) 100%);
  height: 100%;
}

.view{
  background-image: url('../../public/iron-man-3-wallpapers-29651-2000185.jpg'); background-repeat: no-repeat; background-size: cover; background-position: center center;
}
main{
  position: absolute;
  bottom: 0;
  width: 100%;
}
.rgba-container .btn{
  padding: 10px 10px
}
</style>
