/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ca3_Box_22Inputs */

const en_ca3_box_22 = /** @type {(inputs: Ca3_Box_22Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Credit carried`)
};

const fr_ca3_box_22 = /** @type {(inputs: Ca3_Box_22Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Crédit reporté`)
};

/**
* | output |
* | --- |
* | "Credit carried" |
*
* @param {Ca3_Box_22Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const ca3_box_22 = /** @type {((inputs?: Ca3_Box_22Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ca3_Box_22Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_ca3_box_22(inputs)
	return en_ca3_box_22(inputs)
});