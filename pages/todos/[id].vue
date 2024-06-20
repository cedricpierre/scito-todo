<script lang="ts" setup>
import {type InferType, number, object, string} from 'yup'
import type {FormSubmitEvent} from "#ui/types";
import type {Todo} from "~/interfaces/Todo";

type Schema = InferType<typeof schema>

const route = useRoute()

definePageMeta({
	layout: 'main'
})

const client = useSupabaseClient()

const schema = object({
	id: number().nullable(),
	title: string().min(5).required(),
	description: string(),
})

const loading = ref(false)


const state = reactive({
	id: undefined,
	title: '',
	description: '',
	user_uid: '',
	is_done: false,
} as Todo)


async function load() {
	loading.value = true
	const response = await client.from('todos')
			.select('*')
			.eq('id', route.params.id)
			.single()
	
	Object.assign(state, response.data)
	
	loading.value = false
}

async function save(event: FormSubmitEvent<Schema>) {
	loading.value = true
	
	if (event.data?.id) {
		await client
				.from('todos')
				.update(event.data as never)
				.eq('id', event.data.id)
	}
	
	loading.value = false
	
	navigateTo({name: 'todos.index'})
}

onMounted(() => {
	load()
})
</script>

<template>
	<div>
		<UForm :schema="schema" :state="state" @submit="save">
			<UFormGroup label="Title" name="title" required>
				<UInput v-model="state.title" :disabled="loading"/>
			</UFormGroup>
			<UFormGroup label="Description" name="description">
				<UTextarea v-model="state.description" :disabled="loading"/>
			</UFormGroup>
			<UFormGroup label="Done" name="is_done">
				<UCheckbox v-model="state.is_done" :disabled="loading">Done</UCheckbox>
			</UFormGroup>
			
			<UButton :disabled="loading" class="mt-4" type="submit">Save</UButton>
		</UForm>
	</div>
</template>
