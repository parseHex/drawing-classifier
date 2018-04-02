import NN from '../../../learning-machine-learning/src/lib/nn';
import model from '../../models/trained';
import * as constants from './train/constants';

const nn = NN.deserialize(model);

export function predict(data: number[]) {
	const p = nn.predict(data);

	let hv = 0;
	let hi = 0;
	for (let i = 0; i < p.length; i++) {
		if (p[i] > hv) {
			hv = p[i];
			hi = i;
		}
	}
	const label = constants.labels[hi];
	return label;
}
