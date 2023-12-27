import { defineNuxtPlugin } from '#app'
import { clerkPlugin } from 'vue-clerk/plugin'
import NuxtClerkModule from '#nuxt-clerk'

export default defineNuxtPlugin(async (nuxtApp) => {
  const publishableKey = useRuntimeConfig().public.clerkPublishableKey as string;

  nuxtApp.vueApp.use(clerkPlugin, {
    publishableKey,
    options: NuxtClerkModule.vueClerkOptions,
  });
});
