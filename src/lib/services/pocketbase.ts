import Pocketbase from 'pocketbase';
import { writable } from 'svelte/store';
export const pb = new Pocketbase('https://ephemeris.ch');

export const currentUser = writable(pb.authStore);
