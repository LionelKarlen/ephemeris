export default interface ArchiveCache {
	id?: string;
	year: number;
	numEngagements: number;
	totalVisitors: number;
	engagementTypes: { [index: string]: number };
	visitorTypes: { [index: string]: number };
}
