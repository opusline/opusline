/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ca3_Box_3bInputs */



/**
* | output |
* | --- |
* | "Purchases from a supplier not established in France" |
*
* @param {Ca3_Box_3bInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const ca3_box_3b = /** @type {((inputs?: Ca3_Box_3bInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ca3_Box_3bInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Achats auprès d'un assujetti non établi en France")
	return /** @type {LocalizedString} */ ("Purchases from a supplier not established in France")
});