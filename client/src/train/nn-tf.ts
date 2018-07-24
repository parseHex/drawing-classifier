// rewrite of nn-ts using tensorflowjs

import * as tf from '@tensorflow/tfjs';

tf.setBackend('cpu');

type ActivationFunction = 'tanh' | 'sigmoid' | 'relu';

class NeuralNetwork {
	private input_nodes: number;
	private hidden_nodes: number;
	private output_nodes: number;
	private learning_rate: tf.Scalar;
	private activation_function: ActivationFunction;

	private weights_ih: tf.Tensor2D;
	private weights_ho: tf.Tensor2D;
	private bias_h: tf.Tensor2D;
	private bias_o: tf.Tensor2D;

	constructor(a: number | NeuralNetwork, b?: number, c?: number) {
		if (a instanceof NeuralNetwork) {
			this.input_nodes = a.input_nodes;
			this.hidden_nodes = a.hidden_nodes;
			this.output_nodes = a.output_nodes;

			this.weights_ih = this.weights_ih.clone();
			this.weights_ho = this.weights_ho.clone();

			this.bias_h = this.bias_h.clone();
			this.bias_o = this.bias_o.clone();
		} else {
			this.input_nodes = a;
			this.hidden_nodes = b;
			this.output_nodes = c;

			this.weights_ih = tf.randomNormal([this.hidden_nodes, this.input_nodes]); // 64x784
			this.weights_ho = tf.randomNormal([this.output_nodes, this.hidden_nodes]); // 4x64

			this.bias_h = tf.randomNormal([this.hidden_nodes, 1]); // 64x1
			this.bias_o = tf.randomNormal([this.output_nodes, 1]); // 4x1
		}

		this.setLearningRate();
		this.setActivationFunction();
	}

	serializeTensor(t: tf.Tensor) {
		return t.toString().replace(/tensor/i, '').trim();
	}

	setLearningRate(learning_rate: number = 0.1) {
		this.learning_rate = tf.scalar(learning_rate);
	}

	setActivationFunction(func: ActivationFunction = 'sigmoid') {
		this.activation_function = func;
	}

	train(input_array: number[], target_array: number[]) {
		const gradf = tf.grad((x: tf.Tensor) => x[this.activation_function]());

		// Generating the Hidden Outputs
		let inputs: tf.Tensor2D = tf.tensor1d(input_array).reshape([this.input_nodes, 1]); // 784x1
		let hidden: tf.Tensor2D = this.weights_ih.matMul(inputs);
		hidden.add(this.bias_h);
		// activation function!
		hidden[this.activation_function]();

		// Generating the output's output!
		let outputs = this.weights_ho.matMul(hidden);
		outputs.add(this.bias_o);
		outputs[this.activation_function]();

		// Convert array to matrix object
		let targets = tf.tensor(target_array, [this.output_nodes, 1]);

		// Calculate the error
		// ERROR = TARGETS - OUTPUTS
		let output_errors: tf.Tensor2D = targets.sub(outputs);

		// let gradient = outputs * (1 - outputs);
		// Calculate gradient

		let gradients = gradf(outputs);
		// let gradients = Matrix.map(outputs, this.activation_function.dfunc);
		gradients.mul(output_errors);
		gradients.mul(this.learning_rate);

		// Calculate deltas
		let hidden_T = hidden.transpose();
		let weight_ho_deltas = gradients.matMul(hidden_T);

		// Adjust the weights by deltas
		this.weights_ho.add(weight_ho_deltas);
		// Adjust the bias by its deltas (which is just the gradients)
		this.bias_o.add(gradients);

		// Calculate the hidden layer errors
		let who_t = this.weights_ho.transpose();
		let hidden_errors = who_t.matMul(output_errors);

		// Calculate hidden gradient
		let hidden_gradient = gradf(hidden);
		hidden_gradient.mul(hidden_errors);
		hidden_gradient.mul(this.learning_rate);

		// Calcuate input->hidden deltas
		let inputs_T = inputs.transpose();
		let weight_ih_deltas = hidden_gradient.matMul(inputs_T);

		this.weights_ih.add(weight_ih_deltas);
		// Adjust the bias by its deltas (which is just the gradients)
		this.bias_h.add(hidden_gradient);
	}

	predict(input_array: number[]) {
		// Generating the Hidden Outputs
		let inputs: tf.Tensor2D = tf.tensor1d(input_array).reshape([this.input_nodes, 1]);
		let hidden = this.weights_ih.matMul(inputs);
		hidden.add(this.bias_h);
		// activation function!
		hidden[this.activation_function]();

		// Generating the output's output!
		let output = this.weights_ho.matMul(hidden);
		output.add(this.bias_o);
		output[this.activation_function]();

		// Sending back to the caller!
		return output.dataSync();
	}
}

export default NeuralNetwork;
