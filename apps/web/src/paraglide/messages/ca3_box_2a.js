/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ca3_Box_2aInputs */

const en_ca3_box_2a = /** @type {(inputs: Ca3_Box_2aInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Intra-community purchases of services`)
};

const fr_ca3_box_2a = /** @type {(inputs: Ca3_Box_2aInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Achats de prestations intracom`)
};

/**
* | output |
* | --- |
* | "Intra-community purchases of services" |
*
* @param {Ca3_Box_2aInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const ca3_box_2a = /** @type {((inputs?: Ca3_Box_2aInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ca3_Box_2aInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_ca3_box_2a(inputs)
	return en_ca3_box_2a(inputs)
});