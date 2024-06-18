<script setup lang="ts">
import Index from "~/pages/index.vue";
import New from "~/pages/new.vue";

const router = useRouter()

router.addRoute({ path: '/', name: 'index', component: Index })
router.addRoute({ path: '/new', name: 'new', component: New })

</script>

<template>
	<NuxtLayout name="main">
		<NuxtPage/>
	</NuxtLayout>
</template>
