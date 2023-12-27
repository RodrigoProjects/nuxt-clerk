export default defineNuxtConfig({
  modules: ['../src/module'],
  clerk: {
    vueClerk: {
      appearance: {
        variables: {colorPrimary: '#570DF8'},
      }
    }
  },
  devtools: {enabled: true},
  runtimeConfig: {
    public: {
      clerkPublishableKey: ''
    }
  }
})
