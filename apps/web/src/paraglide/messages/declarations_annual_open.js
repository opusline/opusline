/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Annual_OpenInputs */

const en_declarations_annual_open = /** @type {(inputs: Declarations_Annual_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`View →`)
};

const fr_declarations_annual_open = /** @type {(inputs: Declarations_Annual_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Voir →`)
};

/**
* | output |
* | --- |
* | "View →" |
*
* @param {Declarations_Annual_OpenInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_annual_open = /** @type {((inputs?: Declarations_Annual_OpenInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Annual_OpenInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_annual_open(inputs)
	return en_declarations_annual_open(inputs)
});