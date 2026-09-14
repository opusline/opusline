/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ca3_Box_08Inputs */

const en_ca3_box_08 = /** @type {(inputs: Ca3_Box_08Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taxable base · TVA collected`)
};

const fr_ca3_box_08 = /** @type {(inputs: Ca3_Box_08Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base imposable · TVA collectée`)
};

/**
* | output |
* | --- |
* | "Taxable base · TVA collected" |
*
* @param {Ca3_Box_08Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const ca3_box_08 = /** @type {((inputs?: Ca3_Box_08Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ca3_Box_08Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_ca3_box_08(inputs)
	return en_ca3_box_08(inputs)
});