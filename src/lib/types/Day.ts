export default interface Day {
	id?: string;
	timestamp: string;
}

export interface EngagementDay extends Day {
	unable?: string[];
	assigned?: string[];
	reserved?: string[];
	visitorNumber?: number;
	visitorType?: string;
	engagementType?: string;
	comment?: string;
}
