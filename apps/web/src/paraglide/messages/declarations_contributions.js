/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_ContributionsInputs */

const en_declarations_contributions = /** @type {(inputs: Declarations_ContributionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Contributions`)
};

const fr_declarations_contributions = /** @type {(inputs: Declarations_ContributionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cotisations`)
};

/**
* | output |
* | --- |
* | "Contributions" |
*
* @param {Declarations_ContributionsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_contributions = /** @type {((inputs?: Declarations_ContributionsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_ContributionsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_contributions(inputs)
	return en_declarations_contributions(inputs)
});