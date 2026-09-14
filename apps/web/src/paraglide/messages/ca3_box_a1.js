/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ca3_Box_A1Inputs */

const en_ca3_box_a1 = /** @type {(inputs: Ca3_Box_A1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Services sold HT`)
};

const fr_ca3_box_a1 = /** @type {(inputs: Ca3_Box_A1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ventes de services HT`)
};

/**
* | output |
* | --- |
* | "Services sold HT" |
*
* @param {Ca3_Box_A1Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const ca3_box_a1 = /** @type {((inputs?: Ca3_Box_A1Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ca3_Box_A1Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_ca3_box_a1(inputs)
	return en_ca3_box_a1(inputs)
});