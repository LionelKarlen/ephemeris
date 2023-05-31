import type Demonstrator from '$lib/types/Demonstrator';
import type VisitorType from '$lib/types/VisitorType';
import type EngagementType from '$lib/types/EngagementType';
import { writable } from 'svelte/store';
import { pb } from './pocketbase';

export const demonstrators = writable<Demonstrator[]>(
	await pb.collection('demonstrators').getFullList()
);

export const visitorTypes = writable<VisitorType[]>(
	await pb.collection('visitorTypes').getFullList()
);
export const engagementTypes = writable<EngagementType[]>(
	await pb.collection('engagementType').getFullList()
);
export const isEditMode = writable<boolean>(false);
