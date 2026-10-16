/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Scope_DraftInputs */

const en_quotes_scope_draft = /** @type {(inputs: Quotes_Scope_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drafts`)
};

const fr_quotes_scope_draft = /** @type {(inputs: Quotes_Scope_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Brouillons`)
};

/**
* | output |
* | --- |
* | "Drafts" |
*
* @param {Quotes_Scope_DraftInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_scope_draft = /** @type {((inputs?: Quotes_Scope_DraftInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Scope_DraftInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_scope_draft(inputs)
	return en_quotes_scope_draft(inputs)
});