import { data } from './data';

export function fetchSamples() {
    return new Promise((resolve, reject) => {
        const { samples } = data;
        if (samples && samples.length > 0) {
            resolve(samples);
        } else {
            reject('Samples are not found');
        }
    });
}