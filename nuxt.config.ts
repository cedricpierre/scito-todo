// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {
        enabled: true,
    },
    devServer: {
        port: parseInt(process.env.PORT ?? '3000'),
    },
    modules: ["@nuxtjs/supabase", "@nuxt/ui", "@nuxt/icon"],
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