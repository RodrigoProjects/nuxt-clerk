import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addTemplate,
  addImports,
  addComponent,
  installModule
} from '@nuxt/kit'
import {name, version} from '../package.json'
import type {ModuleOptions} from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'clerk',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {},
  async setup(options, nuxt) {
    const {resolve} = createResolver(import.meta.url)

    nuxt.options.build.transpile ||= []
    nuxt.options.build.transpile.push('vue-clerk', '@clerk/clerk-js')

    addTemplate({
      filename: 'nuxt-clerk.mjs',
      getContents: () => [
        'export default {',
        ` vueClerkConfig: ${options.vueClerk ? JSON.stringify(options.vueClerk) : 'null'}`,
        '}'
      ].join('\n')
    })

    nuxt.options.alias['#nuxt-clerk'] = resolve(nuxt.options.buildDir, 'nuxt-clerk')

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolve('./runtime/plugin'))

    addImports([
      // Composables
      'useAuth',
      'useClerk',
      'useSession',
      'useSignIn',
      'useSignUp',
      'useUser'
    ].map(key => ({
      name: key,
      from: '@vue-clerk'
    })))

    const components = [
      // UI Components
      'SignIn',
      'SignUp',
      'SignInButton',
      'SignOutButton',
      'UserButton',
      'UserProfile',
      // Control Components
      'ClerkLoaded',
      'ClerkLoading'
    ]

    components.forEach(key => addComponent({
      name: key,
      export: key,
      filePath: 'vue-clerk'
    }))

    addImports([
      'withClerkAuth',
      'withClerkMiddleware'
    ].map(key => ({
      name: key,
      from: 'h3-clerk'
    })))

    await installModule('@nuxtjs/tailwindcss', {
        exposeConfig: true,
        config: {
          darkMode: 'class',
        }
      }
    )

  }
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    ['clerk']?: Partial<ModuleOptions>
  }

  interface NuxtOptions {
    ['clerk']?: ModuleOptions
  }
}
