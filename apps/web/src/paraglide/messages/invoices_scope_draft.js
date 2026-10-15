/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Scope_DraftInputs */

const en_invoices_scope_draft = /** @type {(inputs: Invoices_Scope_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drafts`)
};

const fr_invoices_scope_draft = /** @type {(inputs: Invoices_Scope_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Brouillons`)
};

/**
* | output |
* | --- |
* | "Drafts" |
*
* @param {Invoices_Scope_DraftInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_scope_draft = /** @type {((inputs?: Invoices_Scope_DraftInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Scope_DraftInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_scope_draft(inputs)
	return en_invoices_scope_draft(inputs)
});