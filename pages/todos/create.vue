<script lang="ts" setup>
import {type InferType, object, string} from 'yup'
import type {FormSubmitEvent} from "#ui/types";
import type {Todo} from "~/interfaces/Todo";

type Schema = InferType<typeof schema>

definePageMeta({
	layout: 'main'
})

const supabase = useSupabaseClient()

const schema = object({
	title: string().min(5).required(),
	description: string(),
})

const state = reactive({
	id: undefined,
	title: '',
	description: '',
	is_done: false,
} as Todo)

const loading = ref(false)

async function save(event: FormSubmitEvent<Schema>) {
	loading.value = true
	
	if (event.data) {
		await supabase
				.from('todos')
				.insert(event.data as any)
	}
	
	loading.value = false
	
	navigateTo({name: 'todos.index'})
}
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
