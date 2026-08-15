/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_No_Invoices_Unbillable_HintInputs */

const en_missions_no_invoices_unbillable_hint = /** @type {(inputs: Missions_No_Invoices_Unbillable_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This mission is not billable — its time produces no invoice.`)
};

const fr_missions_no_invoices_unbillable_hint = /** @type {(inputs: Missions_No_Invoices_Unbillable_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cette mission n'est pas facturable — son temps ne produit pas de facture.`)
};

/**
* | output |
* | --- |
* | "This mission is not billable — its time produces no invoice." |
*
* @param {Missions_No_Invoices_Unbillable_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_no_invoices_unbillable_hint = /** @type {((inputs?: Missions_No_Invoices_Unbillable_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_No_Invoices_Unbillable_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_no_invoices_unbillable_hint(inputs)
	return en_missions_no_invoices_unbillable_hint(inputs)
});