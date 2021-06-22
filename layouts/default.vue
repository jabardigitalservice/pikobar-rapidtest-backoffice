<template>
  <v-app id="pikobar-admin">
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" fixed app>
      <v-list nav>
        <v-list-item id="main-logo" :class="miniVariant && 'logo__small'">
          <v-img src="/pikobar-logo.png" max-width="180" class="ml-4" />
        </v-list-item>
        <v-list-item two-line :class="miniVariant && 'px-0'">
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/81.jpg" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ user.firstName }} {{ user.lastName }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="user.attributes.position_title">
              {{ user.attributes.position_title[0] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense :class="!miniVariant && 'px-0'" class="pikobar-nav">
        <v-list-item-group color="primary">
          <v-list-item
            v-for="(item, i) in menuItems"
            :key="i"
            dense
            :to="item.to"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <v-list-item dense :class="!miniVariant && 'pl-2'" @click="logout">
          <v-list-item-action>
            <v-icon class="mdi-rotate-180">mdi-logout-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Logout
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>
    <v-app-bar app dark fixed top dense class="bg-navbar">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title class="text-subtitle-1 font-weight-medium">
        {{ title }}
      </v-toolbar-title>
    </v-app-bar>
    <v-main class="blue-grey lighten-5">
      <v-container>
        <v-breadcrumbs
          :items="getItems"
          class="primary--text pa-0 font-weight-bold mb-4"
          large
        >
          <template v-slot:item="{ item }">
            <span v-if="item.disabled" class="text-subtitle-1 font-weight-bold">
              {{ item.text }}
            </span>
            <nuxt-link
              v-else
              class="text-subtitle-1 font-weight-bold v-breadcrumbs__item"
              :to="item.to"
            >
              {{ item.text }}
            </nuxt-link>
          </template>
        </v-breadcrumbs>
        <nuxt />
      </v-container>

      <v-snackbar
        v-model="showToast"
        :color="typeToast"
        top
        center
        timeout="3000"
      >
        {{ messageToast }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="showToast = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>

      <v-dialog v-model="showAlert" max-width="290">
        <v-card>
          <v-card-title class="headline">
            {{ titleAlert }}
          </v-card-title>
          <v-card-text>
            {{ messageAlert }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="showAlert = false">
              Cancel
            </v-btn>
            <v-btn color="green darken-1" text @click="okAlert">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      activeItem: null,
      menuItems: [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/',
          permission: 'access-backoffice'
        },
        {
          icon: 'mdi-account-group',
          title: 'Calon Peserta',
          to: '/candidates',
          permission: 'list-applicants'
        },
        {
          icon: 'mdi-card-account-details-star',
          title: 'Daftar Peserta',
          to: '/participants',
          permission: 'list-applicants'
        },
        {
          icon: 'mdi-book',
          title: 'Kegiatan',
          to: '/events',
          permission: 'list-events'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Pikobar Pendaftaran Tes COVID-19',
      showToast: false,
      typeToast: 'success',
      messageToast: '',
      showAlert: false,
      titleAlert: 'Alert',
      messageAlert: '',
      okAlert: () => {}
    }
  },

  computed: {
    ...mapGetters('auth', ['user', 'permissions']),
    ...mapGetters('breadcrumbs', ['getItems'])
  },

  watch: {
    '$route.path'(val) {
      this.activeItem = val
    }
  },

  async created() {
    this.activeItem = this.$route.path
    await this.$store.dispatch('area/getKabkot')
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'toast/show') {
        this.messageToast = state.toast.message
        this.typeToast = state.toast.type
        this.showToast = state.toast.show
      } else if (mutation.type === 'alert/show') {
        this.messageToast = state.alert.title
        this.messageToast = state.alert.message
        this.okAlert = state.alert.ok
        this.showAlert = state.alert.show
      }
    })
  },

  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
    }
  }
}
</script>
