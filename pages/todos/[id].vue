<script setup lang="ts">
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
} as Todo)


async function load() {
	loading.value = true
	const response = await client.from('todos')
			.select('id,title, description, user_uid')
			.eq('id',route.params.id)
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
	
	navigateTo({name: 'index'})
}

onMounted(() => {
	load()
})
</script>

<template>
	<UForm :schema="schema" :state="state" @submit="save">
		<UFormGroup label="Title" name="title" required>
			<UInput :disabled="loading" v-model="state.title"/>
		</UFormGroup>
		<UFormGroup label="Description" name="description">
			<UTextarea :disabled="loading" v-model="state.description"/>
		</UFormGroup>
		<UButton type="submit" :disabled="loading" class="mt-4">Save</UButton>
	</UForm>
</template>
