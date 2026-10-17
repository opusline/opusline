/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ due: NonNullable<unknown> }} Invoices_Amount_HintInputs */

const en_invoices_amount_hint = /** @type {(inputs: Invoices_Amount_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.due} is still due. A smaller amount records a partial payment.`)
};

const fr_invoices_amount_hint = /** @type {(inputs: Invoices_Amount_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reste à payer : ${i?.due}. Un montant inférieur enregistre un paiement partiel.`)
};

/**
* | output |
* | --- |
* | "{due} is still due. A smaller amount records a partial payment." |
*
* @param {Invoices_Amount_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_amount_hint = /** @type {((inputs: Invoices_Amount_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Amount_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_amount_hint(inputs)
	return en_invoices_amount_hint(inputs)
});