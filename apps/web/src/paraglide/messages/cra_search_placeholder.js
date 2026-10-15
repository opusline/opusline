/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Search_PlaceholderInputs */

const en_cra_search_placeholder = /** @type {(inputs: Cra_Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Client, mission, month`)
};

const fr_cra_search_placeholder = /** @type {(inputs: Cra_Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Client, mission, mois`)
};

/**
* | output |
* | --- |
* | "Client, mission, month" |
*
* @param {Cra_Search_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_search_placeholder = /** @type {((inputs?: Cra_Search_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Search_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_search_placeholder(inputs)
	return en_cra_search_placeholder(inputs)
});