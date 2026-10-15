/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ca3_Box_25Inputs */

const en_ca3_box_25 = /** @type {(inputs: Ca3_Box_25Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA credit`)
};

const fr_ca3_box_25 = /** @type {(inputs: Ca3_Box_25Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Crédit de TVA`)
};

/**
* | output |
* | --- |
* | "TVA credit" |
*
* @param {Ca3_Box_25Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const ca3_box_25 = /** @type {((inputs?: Ca3_Box_25Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ca3_Box_25Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_ca3_box_25(inputs)
	return en_ca3_box_25(inputs)
});