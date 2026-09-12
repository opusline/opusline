/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ca3_Box_21Inputs */

const en_ca3_box_21 = /** @type {(inputs: Ca3_Box_21Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other TVA to deduct`)
};

const fr_ca3_box_21 = /** @type {(inputs: Ca3_Box_21Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autre TVA à déduire`)
};

/**
* | output |
* | --- |
* | "Other TVA to deduct" |
*
* @param {Ca3_Box_21Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const ca3_box_21 = /** @type {((inputs?: Ca3_Box_21Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ca3_Box_21Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_ca3_box_21(inputs)
	return en_ca3_box_21(inputs)
});