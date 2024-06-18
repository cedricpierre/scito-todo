<script lang="ts" setup>
import {RealtimeChannel} from "@supabase/realtime-js";
import type {Todo} from "~/interfaces/Todo";

const user = useSupabaseUser()

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

async function remove(row: Todo) {
	if (window.confirm('Are you sure ?') && row.id) {
		await client.from('todos').delete().eq('id', row.id)
		
		todos.value?.splice(todos.value?.indexOf(row), 1)
	}
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
		<UAlert class="my-4" color="primary" title="This is a realtime database. Open multiple tabs to see it in action !"></UAlert>
		<UTable :columns="columns" :loading="loading" :rows="todos">
			<template #title-data="{row}">
				<UButton :to="{name: 'todos.edit',params:{id: row.id}}" variant="link">{{ row.title }}</UButton>
			</template>
			<template #actions-data="{row}">
				<div class="text-right">
					<UButtonGroup>
						<UButton :to="{name: 'todos.edit',params:{id: row.id}}">
							Edit
						</UButton>
						<UButton color="red" @click="remove(row)">
							Delete
						</UButton>
					</UButtonGroup>
				</div>
			</template>
		</UTable>
		
		<UButton :to="{name: 'todos.create'}">Add new note</UButton>
	</div>
</template>