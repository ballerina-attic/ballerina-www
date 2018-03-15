import { samples } from './data.json';

/**
 * Gets a list of all sample files.
 *
 * @param {func} requireContext Webpack func.
 * @returns {Object} The samples.
 */
function requireAll(requireContext) {
    const samplesData = [];
    requireContext.keys().forEach((item) => {
        const module = requireContext(item);
        if (module) {
            samplesData.push({
                fileName: item.substring(2),
                content: module,
            });
        }
    });
    return samplesData;
}

const samplesData = requireAll(require.context('samples', true, /\.bal$/));
const imagesData = requireAll(require.context('samples/images', true, /\.svg$/));

export function fetchSamples() {
    return new Promise((resolve, reject) => {
        if (samples && samples.length > 0) {
            resolve(samples);
        } else {
            reject('Samples are not found');
        }
    });
}

export function fetchSample(fileName) {
    return new Promise((resolve, reject) => {
        const found = samplesData.find((sampleData) => {
            return sampleData.fileName === fileName;
        })
        found ? resolve(found) : reject('Cannot find sample ' + fileName);
    })
}

export function fetchImage(fileName) {
    return new Promise((resolve, reject) => {
        const found = imagesData.find((imageData) => {
            return imageData.fileName === fileName;
        })
        found ? resolve(found) : reject('Cannot find image ' + fileName);
    })
}