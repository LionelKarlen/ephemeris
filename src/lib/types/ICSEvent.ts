import type { DateArray } from 'ics';

export default interface ICSEvent {
	title: string;
	start: DateArray;
	duration: { hours: number };
	startInputType: 'utc';
}
