// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {
        enabled: false,
    },
    future: {
        compatibilityVersion: 4,
    },
    devServer: {
        port: parseInt(process.env.PORT ?? '3000'),
    },
    app:{
        viewTransition: 'always',
        pageTransition: { name: 'page', mode: 'out-in' },
    },
    modules: [
        "@nuxtjs/supabase",
        "@nuxt/ui",
        "@nuxt/icon"
    ],
    tailwindcss: {
        configPath: '@/tailwind.config.ts',
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
})
