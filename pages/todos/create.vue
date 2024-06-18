<script setup lang="ts">
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
	
	navigateTo({name: 'index'})
}
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
