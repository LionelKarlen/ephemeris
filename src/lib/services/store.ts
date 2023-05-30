import type Demonstrator from '$lib/types/Demonstrator';
import { writable } from 'svelte/store';
import { pb } from './pocketbase';

export const demonstrators = writable<Demonstrator[]>(
	await pb.collection('demonstrators').getFullList()
);
