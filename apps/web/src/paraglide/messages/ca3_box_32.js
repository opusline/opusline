/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ca3_Box_32Inputs */

const en_ca3_box_32 = /** @type {(inputs: Ca3_Box_32Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA to pay`)
};

const fr_ca3_box_32 = /** @type {(inputs: Ca3_Box_32Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA à payer`)
};

/**
* | output |
* | --- |
* | "TVA to pay" |
*
* @param {Ca3_Box_32Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const ca3_box_32 = /** @type {((inputs?: Ca3_Box_32Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ca3_Box_32Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_ca3_box_32(inputs)
	return en_ca3_box_32(inputs)
});