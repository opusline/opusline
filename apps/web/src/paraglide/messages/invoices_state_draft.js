/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_State_DraftInputs */

const en_invoices_state_draft = /** @type {(inputs: Invoices_State_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`draft`)
};

const fr_invoices_state_draft = /** @type {(inputs: Invoices_State_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`brouillon`)
};

/**
* | output |
* | --- |
* | "draft" |
*
* @param {Invoices_State_DraftInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_state_draft = /** @type {((inputs?: Invoices_State_DraftInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_State_DraftInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_state_draft(inputs)
	return en_invoices_state_draft(inputs)
});