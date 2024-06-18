<script lang="ts" setup>
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
					<UInput v-model="credentials.email" :disabled="loading"></UInput>
				</UFormGroup>
				<UFormGroup label="Password" name="password" required>
					<UInput v-model="credentials.password" :disabled="loading" type="password"></UInput>
				</UFormGroup>
				<UButton class="mt-4" type="submit">Log in</UButton>
			</UForm>
		</UCard>
	</UContainer>
</template>
