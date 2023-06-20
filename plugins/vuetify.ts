// plugins/vuetify.js
// Guide: https://codybontecou.com/how-to-use-vuetify-with-nuxt-3.html
// import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'

// export default defineNuxtPlugin(nuxtApp => {
//   const vuetify = createVuetify({
//     ssr: true,
//     components,
//     directives,
//   })

//   nuxtApp.vueApp.use(vuetify)
// })

// ------------------------------

import { createVuetify } from "vuetify";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    defaults,
    // add theme
    theme: {
      defaultTheme: DARK_THEME,
      themes: {
        light,
        dark,
      },
      // add color variations
      //   variations: {
      //     colors: ["primary", "secondary"],
      //     lighten: 3,
      //     darken: 3,
      //   },
    },
    // Add the custom iconset
    icons: {
      defaultSet: "custom",
      aliases,
      sets: {
        custom,
      },
    },
  });

  app.vueApp.use(vuetify);
});
