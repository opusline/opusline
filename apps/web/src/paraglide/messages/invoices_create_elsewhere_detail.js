/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Create_Elsewhere_DetailInputs */

const en_invoices_create_elsewhere_detail = /** @type {(inputs: Invoices_Create_Elsewhere_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You report the amount and drop the PDF. Opusline keeps track of it.`)
};

const fr_invoices_create_elsewhere_detail = /** @type {(inputs: Invoices_Create_Elsewhere_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vous reportez le montant et déposez le PDF. Opusline en garde la trace.`)
};

/**
* | output |
* | --- |
* | "You report the amount and drop the PDF. Opusline keeps track of it." |
*
* @param {Invoices_Create_Elsewhere_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_create_elsewhere_detail = /** @type {((inputs?: Invoices_Create_Elsewhere_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Create_Elsewhere_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_create_elsewhere_detail(inputs)
	return en_invoices_create_elsewhere_detail(inputs)
});