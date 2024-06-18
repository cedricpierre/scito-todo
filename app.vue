<script setup lang="ts">
import Index from "~/pages/index.vue";
import New from "~/pages/todos/new.vue";
import Edit from "~/pages/todos/[id].vue";

const router = useRouter()

router.addRoute({ path: '/todos', name: 'index', component: Index })
router.addRoute({ path: '/todos/create', name: 'create', component: New })
router.addRoute({ path: '/todos/:id', name: 'edit', component: Edit })

</script>

<template>
	<NuxtLayout name="main">
		<NuxtPage/>
	</NuxtLayout>
</template>
