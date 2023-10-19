export type AppStore = {
	route: 'AUTH' | 'PROFILE' | 'SEARCH';
	configuration: Configuration;
};

export type UserMe = {
	email: string;
	name: string;
	picture: string;
	crew?: string;
	company?: string;
};

export type SetUserProfile = {
	crew: string;
	company: string;
};

export type Configuration = {
	crews: string[];
	skills: Record<string, string[]>;
	scoreRange: {
		min: number;
		max: number;
	};
};

export type Skill = {
	skill: string;
	score: number;
	skillCategory: string;
};
