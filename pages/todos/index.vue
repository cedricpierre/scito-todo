<script lang="ts" setup>
import {RealtimeChannel} from "@supabase/realtime-js";
import type {Todo} from "~/interfaces/Todo";

const user = useSupabaseUser()

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

const client = useSupabaseClient()

const loading = ref(false)

let realtimeChannel: RealtimeChannel
const {data: todos, refresh} = await useAsyncData('todos', async () => {
	if (user.value) {
		loading.value = true
		
		const response = await client.from('todos')
				.select('id,title, description, user_uid')
				.order('id', {
					ascending: false,
				})
		
		loading.value = false
		
		return response.data as Array<Todo>
	}
	return []
})

randomize()

async function remove(row: Todo) {
	if (window.confirm('Are you sure ?') && row.id) {
		await client.from('todos').delete().eq('id', row.id)
		
		todos.value?.splice(todos.value?.indexOf(row), 1)
	}
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
		<div class="postit relative w-100 bg-amber-50 overflow-auto rounded-xl" :style="{ height: '600px' }">
			<div
					v-for="(todo,t) in todos"
					@click.prevent="selectedIndex = t"
					:class="{
					'selected': selectedIndex === t
				}"
					:style="{
					width: '200px',
					height: '200px',
					transform: `rotate(${(((Math.random() * randomized) * 30) - 15)}deg)`,
					left: `${((Math.random() * randomized) * 100)}%`,
					top: `${((Math.random() * randomized) * 100)}%`,
					boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
					transition: 'all 400ms ease',
				}"
					class="flex flex-col bg-amber-300 w-1/4 h-1/4 absolute p-4 text-center rounded-md"
			>
				<div class="flex-grow">
					<h2 class="text-3xl text-amber-950">{{ todo.title }}</h2>
					<p class="m-4">{{ todo.description }}</p>
				</div>
				<div class="flex-shrink">
					<div class="flex gap-2 justify-center align-middle">
						
						<UButton variant="link" color="black" :to="{name: 'todos.edit',params:{id: todo.id}}">Edit</UButton>
						<UButton color="red" @click="remove(todo)">Remove</UButton>
					</div>
				</div>
			
			</div>
		</div>
	</div>
</template>

<style>
.selected {
	transform: rotate(0deg) !important;
	left: calc(50% - 100px) !important;
	top: calc(50% - 100px) !important;
	z-index: 2;
	zoom: 1.2;
}
</style>
