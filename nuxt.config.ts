// https://v3.nuxtjs.org/api/configuration/nuxt.config
import vuetify from 'vite-plugin-vuetify'
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

// PWA Config
const title = "JSON 编排器";
const shortTitle = "JSON 编排器";
const description =
  "JSON 编排器可以实现 JSON 美化/格式化/、JSON 合法化（从 JavaScript/JS 对象中转化为 合格的 JSON 对象），页面简单干净，专注处理 JSON 格式。";
const image = "https://vuetify3nuxt3starter.behonbaker.com/starter.png";
const url = "https://vuetify3nuxt3starter.behonbaker.com/";

export default defineNuxtConfig({
  ssr: true,
  css: [
    // 'vuetify/lib/styles/main.sass',
    '@/assets/main.scss',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  modules: ['@nuxtjs/tailwindcss', '@element-plus/nuxt',     async (options, nuxt) => {
    nuxt.hooks.hook("vite:extendConfig", (config) =>
      // @ts-ignore
      config.plugins.push(vuetify())
    );
  },],
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },

  app: {
    head: {
      title: "JSON Orchestra",
      titleTemplate: "%s | JSON 编排器",
      link: [
        { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
        { rel: "preconnect", href: "https://rsms.me/" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "canonical", href: url },
      ],
      meta: [
        {
          hid: "description",
          name: "description",
          content: description,
        },
        { property: "og:site_name", content: title },
        { hid: "og:type", property: "og:type", content: "website" },
        {
          hid: "og:url",
          property: "og:url",
          content: url,
        },
        {
          hid: "og:image:secure_url",
          property: "og:image:secure_url",
          content: image,
        },
        {
          hid: "og:title",
          property: "og:title",
          content: title,
        },
        {
          hid: "og:description",
          property: "og:description",
          content: description,
        },
        {
          hid: "og:image",
          property: "og:image",
          content: image,
        },
        //Twitter
        { name: "twitter:card", content: "summary_large_image" },
        {
          hid: "twitter:url",
          name: "twitter:url",
          content: url,
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: title,
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: description,
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: image,
        },
      ],
    },
  },
})
