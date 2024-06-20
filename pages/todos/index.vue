<script lang="ts" setup>
import {RealtimeChannel} from "@supabase/realtime-js";
import type {Todo} from "~/interfaces/Todo";
import PostIt from "~/components/PostIt.vue";

const user = useSupabaseUser()
const client = useSupabaseClient()

const randomized = ref(0)

const selectedIndex = ref()

randomized.value = Math.random()

const columns = [
	{
		key: 'id',
		label: 'Id',
		class: 'w-1'
	},
	{
		key: 'title',
		label: 'Title',
	},
	{
		key: 'description',
		label: 'Description',
	},
	{
		key: 'actions',
		label: 'Actions',
		class: 'text-right'
		
	}
];

const loading = ref(false)

let realtimeChannel: RealtimeChannel
const {data: todos, refresh} = await useAsyncData('todos', async () => {
	if (user.value) {
		loading.value = true
		
		const response = await client.from('todos')
				.select('*')
				.order('id', {
					ascending: false,
				})
		
		loading.value = false
		
		return response.data as Array<Todo>
	}
	return []
})

randomize()

async function remove(todo: Todo) {
	if (window.confirm('Are you sure ?') && todo.id) {
		await client.from('todos').delete().eq('id', todo.id)
		
		props.todos?.splice(props.todos?.indexOf(todo), 1)
	}
}

async function mark(todo: Todo) {
	await client.from('todos').update({is_done:!todo.is_done}).eq('id', todo.id)
}

function randomize() {
	selectedIndex.value = null
	randomized.value = Math.random()
}

onMounted(() => {
	realtimeChannel = client.channel('public:todos').on(
			'postgres_changes',
			{event: '*', schema: 'public', table: 'todos'},
			() => refresh()
	)
	
	realtimeChannel.subscribe()
})

onUnmounted(() => {
	client.removeChannel(realtimeChannel)
})
</script>

<template>
	<div>
		<div class="flex py-4 gap-2">
			<div class="flex flex-row flex-grow">
				<UAlert color="primary" title="This is a realtime database. Open multiple tabs to see it in action !"></UAlert>
			</div>
			<div class="flex gap-2 justify-end">
				<UButton color="amber" @click="randomize">Randomize</UButton>
				<UButton :to="{name: 'todos.create'}" color="green">Add new note</UButton>
			</div>
		</div>
		<div class="relative w-100 bg-amber-50 overflow-auto rounded-xl" :style="{ height: '600px' }">
			<PostIt
				v-for="(todo,t) in todos"
				:todo="todo"
				:todos="todos"
				:index="t"
				@click.stop.prevent="selectedIndex = t"
				:class="{
					'selected': selectedIndex === t
				}"
				:style="{
					transform: `translateZ(0px) rotate(${(((Math.random() * randomized) * 30) - 15)}deg)`,
					zIndex: `${Math.ceil(Math.random() * todos.length)}`,
					left: `${((Math.random() * randomized) * 100)}%`,
					top: `${((Math.random() * randomized) * 100)}%`,
					boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
					transition: 'all 400ms ease',
				}"
				@remove="remove"
				@mark="mark"
			>
			</PostIt>
		</div>
	</div>
</template>

<style>
.selected {
	transform: rotate(0deg) scale(1.8) !important;
	left: calc(50% - 100px) !important;
	top: calc(50% - 100px) !important;
	z-index: 200;
}
</style>
