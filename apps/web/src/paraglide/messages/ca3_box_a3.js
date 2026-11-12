/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ca3_Box_A3Inputs */

const en_ca3_box_a3 = /** @type {(inputs: Ca3_Box_A3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Purchases of services from a supplier not established in France (art. 283-2 CGI)`)
};

const fr_ca3_box_a3 = /** @type {(inputs: Ca3_Box_A3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Achats de prestations de services auprès d'un assujetti non établi en France (art 283-2 CGI)`)
};

/**
* | output |
* | --- |
* | "Purchases of services from a supplier not established in France (art. 283-2 CGI)" |
*
* @param {Ca3_Box_A3Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const ca3_box_a3 = /** @type {((inputs?: Ca3_Box_A3Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ca3_Box_A3Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_ca3_box_a3(inputs)
	return en_ca3_box_a3(inputs)
});