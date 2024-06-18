<script setup lang="ts">
import {type InferType, object, string} from 'yup'
import type {FormSubmitEvent} from "#ui/types";

type Schema = InferType<typeof schema>

const client = useSupabaseClient()

const schema = object({
	email: string().email().required(),
	password: string().min(5).required()
})

const credentials = reactive({
	email: '',
	password: '',
})

const loading = ref(false)

async function signInWithOtp(event: FormSubmitEvent<Schema>) {
	loading.value = true
	
	const {error} = await client.auth.signInWithPassword(event.data)
	
	loading.value = false
	
	if (!error) {
		navigateTo({name: 'todos.index'})
	}
}
</script>

<template>
	<UContainer>
		<UCard class="w-80 mx-auto">
			<UForm :schema="schema" :state="credentials" class="space-y-4" @submit="signInWithOtp">
				<UFormGroup label="Email" name="email" required>
					<UInput :disabled="loading" v-model="credentials.email"></UInput>
				</UFormGroup>
				<UFormGroup label="Password" name="password" required>
					<UInput :disabled="loading" type="password" v-model="credentials.password"></UInput>
				</UFormGroup>
				<UButton type="submit" class="mt-4">Log in</UButton>
			</UForm>
		</UCard>
	</UContainer>
</template>
