<script setup lang="ts">
	import TodosCreate from "~/pages/todos/create.vue";
	import TodosList from "~/pages/todos/index.vue";
	import TodosEdit from "~/pages/todos/[id].vue";
	import Index from "~/pages/index.vue";
	
	const router = useRouter()
	
	router.addRoute({path: '/', name: 'index', component: Index})
	router.addRoute({path: '/todos', name: 'todos.index', component: TodosList})
	router.addRoute({path: '/todos/create', name: 'todos.create', component: TodosCreate})
	router.addRoute({path: '/todos/:id', name: 'todos.edit', component:TodosEdit})

	const colorMode = useColorMode()
	colorMode.preference = 'light'
	
</script>

<template>
	<NuxtLayout name="main">
		<NuxtPage/>
	</NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
	transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
	opacity: 0;
	filter: blur(1rem);
}
</style>
