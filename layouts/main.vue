<script setup lang="ts">
const supabase = useSupabaseClient()

async function signOut() {
	const {error} = await supabase.auth.signOut()
	
	if(!error) {
		navigateTo('/login')
	}
}

const user = useSupabaseUser()

const colorMode = useColorMode()

const links = [[
	{
		label: 'List notes',
		to: {name: 'index'}
	},
], [
	{
		label: `Mode`,
		click: () => colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark',
	},
	{
		label: 'Logout',
		click: signOut
	},
]]
</script>
<template>
	<UHorizontalNavigation v-if="user" :links="links"></UHorizontalNavigation>
	<UContainer class="py-4">
		<slot/>
	</UContainer>
</template>
