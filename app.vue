<script setup lang="ts">
import Todos from "~/pages/todos.vue";
import Create from "~/pages/todos/create.vue";
import Edit from "~/pages/todos/[id].vue";
import Index from "~/pages/index.vue";

const router = useRouter()

router.addRoute({path: '/', name: 'index', component: Index})
router.addRoute({path: '/todos', name: 'index', component: Todos})
router.addRoute({path: '/todos/create', name: 'create', component: Create})
router.addRoute({path: '/todos/:id', name: 'edit', component: Edit})

</script>

<template>
	<NuxtLayout name="main">
		<NuxtPage/>
	</NuxtLayout>
</template>
