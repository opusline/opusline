/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Scope_RefusedInputs */

const en_quotes_scope_refused = /** @type {(inputs: Quotes_Scope_RefusedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Refused`)
};

const fr_quotes_scope_refused = /** @type {(inputs: Quotes_Scope_RefusedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Refusés`)
};

/**
* | output |
* | --- |
* | "Refused" |
*
* @param {Quotes_Scope_RefusedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_scope_refused = /** @type {((inputs?: Quotes_Scope_RefusedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Scope_RefusedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_scope_refused(inputs)
	return en_quotes_scope_refused(inputs)
});