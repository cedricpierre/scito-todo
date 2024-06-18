<script setup lang="ts">
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
	}
}

onMounted(() => {
	// Real time listener for new workouts
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
	<UAlert class="my-4" title="This is a realtime database. Open multiple tabs to see it in action !"></UAlert>
	<UTable :loading="loading" :rows="todos" :columns="columns">
		<template #title-data="{row}">
			<UButton variant="link" :to="{name: 'edit',params:{id: row.id}}">{{row.title}}</UButton>
		</template>
		<template #actions-data="{row}">
			<div class="text-right">
				<UButtonGroup>
				
				<UButton variant="link" :to="{name: 'edit',params:{id: row.id}}">
					Edit
				</UButton>
				<UButton @click="remove(row)" color="red">
					Delete
				</UButton>
				</UButtonGroup>
			</div>
		</template>
	</UTable>
	
	<UButton :to="{name: 'new'}">Add new note</UButton>
</template>
