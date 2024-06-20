<script setup lang="ts">
import type { PropType } from 'vue'
import type {Todo} from "~/interfaces/Todo.js";

const props = defineProps({
	todos: {
		type: Array<Todo>,
		required: true,
	},
	todo: {
		type: Object as PropType<Todo>,
		required: true,
	},
	index: {
		type: Number,
		required: true,
	}
})

const emits = defineEmits(['remove','mark'])
</script>
<template>
	<div class="postit flex flex-col bg-amber-300 w-1/4 h-1/4 absolute p-4 text-center rounded-md overflow-x-hidden overflow-y-hidden">
		<div
			class="bg-green-600 text-white uppercase text-xs -rotate-45 absolute left-0 pt-1 top-0 pl-6 pr-6"
			:style="{
				opacity: todo.is_done ? 1 : 0,
				width: '100px',
				height: '25px',
				left: '-30px',
				top: '10px',
				transition: 'all 400ms ease'
			}"
			
		>
			done
		</div>
		<NuxtLink :to="{name: 'todos.edit',params:{id: todo.id}}" class="underline text-2xl text-amber-950">{{ props.todo.title }}</NuxtLink>
		<div class="flex-grow overflow-auto">
			<p class="m-4 ">{{ props.todo.description }}</p>
		</div>
		<div class="flex-shrink">
			<div class="flex gap-2 justify-center align-middle">
				<UButton size="xs" :color="!todo.is_done ? 'green' : 'white'" @click="emits('mark',todo)">
					{{!todo.is_done ? 'Done' : 'Todo'}}
				</UButton>
				<UButton size="xs" color="red" @click="emits('remove',todo)">Remove</UButton>
			</div>
		</div>
	</div>
</template>
