/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Total_DueInputs */

const en_declarations_total_due = /** @type {(inputs: Declarations_Total_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total to pay`)
};

const fr_declarations_total_due = /** @type {(inputs: Declarations_Total_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total à payer`)
};

/**
* | output |
* | --- |
* | "Total to pay" |
*
* @param {Declarations_Total_DueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_total_due = /** @type {((inputs?: Declarations_Total_DueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Total_DueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_total_due(inputs)
	return en_declarations_total_due(inputs)
});