/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_No_Invoices_TitleInputs */

const en_common_no_invoices_title = /** @type {(inputs: Common_No_Invoices_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No invoices`)
};

const fr_common_no_invoices_title = /** @type {(inputs: Common_No_Invoices_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune facture`)
};

/**
* | output |
* | --- |
* | "No invoices" |
*
* @param {Common_No_Invoices_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_no_invoices_title = /** @type {((inputs?: Common_No_Invoices_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_No_Invoices_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_no_invoices_title(inputs)
	return en_common_no_invoices_title(inputs)
});