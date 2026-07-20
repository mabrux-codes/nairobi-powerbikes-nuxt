export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    'motion-v/nuxt',
  ],

  components: {
    dirs: ['~/components', '~/components/home', '~/components/layout', '~/components/ui', '~/components/dashboard'],
  },

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  runtimeConfig: {
    public: {
      pocketBaseUrl: process.env.NUXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090',
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN || '',
    },
  },

  nitro: {
    preset: 'vercel',
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },

  app: {
    head: {
      title: 'Nairobi Powerbikes',
      meta: [
        { name: 'description', content: 'Premium motorcycle dealership in Nairobi. Browse our collection of motorcycles, accessories, and apparel.' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
        { rel: 'preload', href: '/fonts/AmericanCaptain-MdEY.otf', as: 'font', type: 'font/otf', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap' },
      ],
      script: [
        {
          innerHTML: `
window.__ow = window.__ow || {};
window.__ow.organizationId = "83aea25b-ac79-4f11-920e-7a408aa5631c";
window.__ow.integration_name = "manual_settings";
window.__ow.product_name = "openwidget";
;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[OpenWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.openwidget.com/openwidget.js",t.head.appendChild(n)}};!n.__ow.asyncInit&&e.init(),n.OpenWidget=n.OpenWidget||e}(window,document,[].slice))
          `,
          type: 'text/javascript',
          tagPosition: 'body',
        },
      ],
      noscript: [
        { innerHTML: 'You need to <a href="https://www.openwidget.com/enable-javascript" rel="noopener nofollow">enable JavaScript</a> to use the communication tool powered by <a href="https://www.openwidget.com/" rel="noopener nofollow" target="_blank">OpenWidget</a>' },
      ],
    },
  },
})
