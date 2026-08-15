/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Search_AriaInputs */

const en_cra_search_aria = /** @type {(inputs: Cra_Search_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search activity reports`)
};

const fr_cra_search_aria = /** @type {(inputs: Cra_Search_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rechercher un compte rendu`)
};

/**
* | output |
* | --- |
* | "Search activity reports" |
*
* @param {Cra_Search_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_search_aria = /** @type {((inputs?: Cra_Search_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Search_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_search_aria(inputs)
	return en_cra_search_aria(inputs)
});