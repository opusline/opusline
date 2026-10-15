/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Add_Forfait_DraftInputs */

const en_invoices_add_forfait_draft = /** @type {(inputs: Invoices_Add_Forfait_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Held by a draft`)
};

const fr_invoices_add_forfait_draft = /** @type {(inputs: Invoices_Add_Forfait_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retenu par un brouillon`)
};

/**
* | output |
* | --- |
* | "Held by a draft" |
*
* @param {Invoices_Add_Forfait_DraftInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_forfait_draft = /** @type {((inputs?: Invoices_Add_Forfait_DraftInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_Forfait_DraftInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_forfait_draft(inputs)
	return en_invoices_add_forfait_draft(inputs)
});