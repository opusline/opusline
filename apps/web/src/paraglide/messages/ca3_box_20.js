/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ca3_Box_20Inputs */

const en_ca3_box_20 = /** @type {(inputs: Ca3_Box_20Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other goods and services`)
};

const fr_ca3_box_20 = /** @type {(inputs: Ca3_Box_20Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autres biens et services`)
};

/**
* | output |
* | --- |
* | "Other goods and services" |
*
* @param {Ca3_Box_20Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const ca3_box_20 = /** @type {((inputs?: Ca3_Box_20Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ca3_Box_20Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_ca3_box_20(inputs)
	return en_ca3_box_20(inputs)
});