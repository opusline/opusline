/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Reopen_DraftInputs */

const en_invoices_reopen_draft = /** @type {(inputs: Invoices_Reopen_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not sent after all`)
};

const fr_invoices_reopen_draft = /** @type {(inputs: Invoices_Reopen_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pas envoyée finalement`)
};

/**
* | output |
* | --- |
* | "Not sent after all" |
*
* @param {Invoices_Reopen_DraftInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_reopen_draft = /** @type {((inputs?: Invoices_Reopen_DraftInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Reopen_DraftInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_reopen_draft(inputs)
	return en_invoices_reopen_draft(inputs)
});