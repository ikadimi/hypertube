<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-space-around>
      <v-flex xs12 md6 class="mt-5">
        <v-card style="max-width:500px">
          <v-card-title class="info white--text subheading" primary-title>
            <span class="title">404</span>
          </v-card-title>
          <v-card-text class="display-1 ma-8" >
          There is no page here.
          </v-card-text>
          <v-card-actions>
            <v-btn text block class="info darken-3 white--text" to="/home">
              <v-icon left v-text="'mdi-arrow-left'" />
              Back
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
