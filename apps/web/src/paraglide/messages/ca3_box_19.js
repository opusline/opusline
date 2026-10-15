/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ca3_Box_19Inputs */

const en_ca3_box_19 = /** @type {(inputs: Ca3_Box_19Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixed assets`)
};

const fr_ca3_box_19 = /** @type {(inputs: Ca3_Box_19Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Immobilisations`)
};

/**
* | output |
* | --- |
* | "Fixed assets" |
*
* @param {Ca3_Box_19Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const ca3_box_19 = /** @type {((inputs?: Ca3_Box_19Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ca3_Box_19Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_ca3_box_19(inputs)
	return en_ca3_box_19(inputs)
});