export const labels = ['diamond', 'donut', 'fork', 'hexagon'];
export const labelOutputs = [
	Uint8Array.from([1, 0, 0, 0]),
	Uint8Array.from([0, 1, 0, 0]),
	Uint8Array.from([0, 0, 1, 0]),
	Uint8Array.from([0, 0, 0, 1]),
];

export const TESTING_AMOUNT = 0.2; // % of data to be used for testing
export const PATIENCE = 5; // how many epochs with no progress before early stop
export const MIN_PROGRESS_THRESHOLD = 0.75; // min accuracy increase % to be considered "progress"
export const TEST_EVERY = 1; // test every 50 iterations

// accuracy loss (from highest %) before stopping early
// i.e. "if accuracy drops x below the highest ever accuracy, stop"
export const ACCURACY_LOSS_THRESHOLD = 2;

export const INPUT_NODES = 784;
export const HIDDEN_NODES = 64;
export const OUTPUT_NODES = labels.length;
export const LEARNING_RATE = 0.1;
