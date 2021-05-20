export default interface SpaceLaunch {
	id: number;
	name: string;
	link: string;
	provider: string;
	vehicle: string;
	win_open: string | null;
	win_close: string | null;
	date_str: string;
}
