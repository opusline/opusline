/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Scope_AllInputs */

const en_quotes_scope_all = /** @type {(inputs: Quotes_Scope_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All`)
};

const fr_quotes_scope_all = /** @type {(inputs: Quotes_Scope_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tous`)
};

/**
* | output |
* | --- |
* | "All" |
*
* @param {Quotes_Scope_AllInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_scope_all = /** @type {((inputs?: Quotes_Scope_AllInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Scope_AllInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_scope_all(inputs)
	return en_quotes_scope_all(inputs)
});