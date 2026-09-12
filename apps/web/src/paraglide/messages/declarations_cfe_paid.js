/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_PaidInputs */

const en_declarations_cfe_paid = /** @type {(inputs: Declarations_Cfe_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CFE marked as paid`)
};

const fr_declarations_cfe_paid = /** @type {(inputs: Declarations_Cfe_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CFE marquée payée`)
};

/**
* | output |
* | --- |
* | "CFE marked as paid" |
*
* @param {Declarations_Cfe_PaidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_paid = /** @type {((inputs?: Declarations_Cfe_PaidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_PaidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_paid(inputs)
	return en_declarations_cfe_paid(inputs)
});