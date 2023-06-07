import type Demonstrator from '$lib/types/Demonstrator';
import type VisitorType from '$lib/types/VisitorType';
import type EngagementType from '$lib/types/EngagementType';
import { writable } from 'svelte/store';
import { pb } from './pocketbase';
import type Warning from '$lib/types/Warning';

export const demonstrators = writable<Demonstrator[]>(
	await pb.collection('demonstrators').getFullList()
);

export const visitorTypes = writable<VisitorType[]>(
	await pb.collection('visitorType').getFullList()
);
export const engagementTypes = writable<EngagementType[]>(
	await pb.collection('engagementType').getFullList()
);
export const warnings = writable<Warning[]>(await pb.collection('warnings').getFullList());
export const isEditMode = writable<boolean>(false);

export const showModal = writable<boolean>(false);
