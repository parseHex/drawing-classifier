export interface StateUpdate {
	epoch: number;
	nn: string;
	accuracy: number;
	correct: number;
	incorrect: number;
	time: number;
}
export interface Message {
	type: string;
	data?: any;
}
export interface SlimData {
	data: Uint8Array;
	label: number;
}
