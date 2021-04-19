<template>
  <v-app id="inspire">
    <v-main>
      <v-row class="login-full-height">
        <v-col>
          <div class="mx-16 my-7">
            <v-img src="/pikobar-logo.png" width="176" height="60" />
          </div>
          <v-row class="login-height-icon">
            <v-col class="d-flex align-end">
              <div class="ml-5">
                <v-img src="/login-asset.svg" width="248" height="248" />
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col offset="1">
          <div class="my-12 pt-8">
            <h2>Selamat datang di Aplikasi</h2>
            <h2 class="primary--text">Pikobar Pendaftaran Tes</h2>
          </div>
          <div align="center">
            <v-img src="/login-icon.svg" width="300" />
          </div>
          <div class="my-8">
            <v-alert
              border="left"
              colored-border
              color="primary"
              class="text--disabled text-caption"
            >
              Kamu berada di Aplikasi Pikobar Pendaftaran Tes Covid-19 Jawa
              Barat. Klik tombol “Masuk Dengan SSO”, kemudian login menggunakan
              email dan kata sandi yang sudah diberikan.
            </v-alert>
          </div>
          <div>
            <v-btn color="primary" block large dark @click="login">
              Masuk dengan SSO
            </v-btn>
          </div>
        </v-col>
        <v-col offset="1" class="d-flex justify-end mr-3">
          <div class="ma-1">
            <v-img src="/login-asset2.svg" width="248" height="248" />
          </div>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
export default {
  layout: 'auth',

  mounted() {
    this.$keycloak.init()
  },

  methods: {
    login() {
      this.$keycloak.login({ redirectUri: process.env.keycloakRedirectUri })
    }
  }
}
</script>
