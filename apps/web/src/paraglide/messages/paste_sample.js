/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_SampleInputs */

const en_paste_sample = /** @type {(inputs: Paste_SampleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Try with an example`)
};

const fr_paste_sample = /** @type {(inputs: Paste_SampleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Essayer avec un exemple`)
};

/**
* | output |
* | --- |
* | "Try with an example" |
*
* @param {Paste_SampleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_sample = /** @type {((inputs?: Paste_SampleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_SampleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_sample(inputs)
	return en_paste_sample(inputs)
});