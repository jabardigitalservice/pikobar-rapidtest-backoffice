import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  generate: {
    fallback: true
  },

  env: {
    appEnv: process.env.APP_ENV || 'local',
    appName: process.env.APP_NAME || 'Application',
    apiUrl: process.env.API_URL,
    keycloakUrl: process.env.KEYCLOAK_URL,
    keycloakRealm: process.env.KEYCLOAK_REALM,
    keycloakClientId: process.env.KEYCLOAK_CLIENT_ID,
    keycloakRedirectUri: process.env.KEYCLOAK_REDIRECT_URI,
    featureIntegrationLabkes: process.env.FEATURE_INTEGRATION_LABKES
  },

  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.APP_NAME || 'Application',
    title: process.env.APP_NAME || 'Application',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Aplikasi Pikobar Pendaftaran Tes COVID-19 Provinsi Jawa Barat'
      },
      { hid: 'theme-color', name: 'theme-color', content: '#FFFFFF' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#2196F3' },
  /*
   ** Global CSS
   */
  css: ['~/assets/app.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/axios',
    '~/plugins/keycloak',
    '~/plugins/global-components',
    '~/plugins/validation',
    '~/plugins/toast',
    '~/plugins/alert'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/date-fns'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/sentry'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        light: {
          primary: '#028EC6'
        },
        dark: {
          primary: '#028EC6',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    },
    options: {
      customProperties: true
    }
  },

  dateFns: {
    defaultLocale: 'id'
  },

  sentry: {
    dsn: process.env.SENTRY_DSN,
    config: {
      environment: process.env.APP_ENV || 'local'
    }
  },

  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
