/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ca3_Box_B4Inputs */

const en_ca3_box_b4 = /** @type {(inputs: Ca3_Box_B4Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Purchases of goods or services from a supplier not established in France (art. 283-1 CGI)`)
};

const fr_ca3_box_b4 = /** @type {(inputs: Ca3_Box_B4Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Achats de biens ou prestations de services auprès d'un assujetti non établi en France (art 283-1 CGI)`)
};

/**
* | output |
* | --- |
* | "Purchases of goods or services from a supplier not established in France (art. 283-1 CGI)" |
*
* @param {Ca3_Box_B4Inputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const ca3_box_b4 = /** @type {((inputs?: Ca3_Box_B4Inputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ca3_Box_B4Inputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_ca3_box_b4(inputs)
	return en_ca3_box_b4(inputs)
});