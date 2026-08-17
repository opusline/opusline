/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Forfait_Over_BilledInputs */

const en_forfait_over_billed = /** @type {(inputs: Forfait_Over_BilledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Billed past the forfait`)
};

const fr_forfait_over_billed = /** @type {(inputs: Forfait_Over_BilledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturé au-delà du forfait`)
};

/**
* | output |
* | --- |
* | "Billed past the forfait" |
*
* @param {Forfait_Over_BilledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const forfait_over_billed = /** @type {((inputs?: Forfait_Over_BilledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forfait_Over_BilledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_forfait_over_billed(inputs)
	return en_forfait_over_billed(inputs)
});