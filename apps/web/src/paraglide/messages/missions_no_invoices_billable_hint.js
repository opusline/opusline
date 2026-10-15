/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_No_Invoices_Billable_HintInputs */

const en_missions_no_invoices_billable_hint = /** @type {(inputs: Missions_No_Invoices_Billable_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoices will appear here as soon as billable time is tracked on this mission.`)
};

const fr_missions_no_invoices_billable_hint = /** @type {(inputs: Missions_No_Invoices_Billable_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les factures apparaîtront ici dès que du temps facturable aura été saisi sur cette mission.`)
};

/**
* | output |
* | --- |
* | "Invoices will appear here as soon as billable time is tracked on this mission." |
*
* @param {Missions_No_Invoices_Billable_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_no_invoices_billable_hint = /** @type {((inputs?: Missions_No_Invoices_Billable_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_No_Invoices_Billable_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_no_invoices_billable_hint(inputs)
	return en_missions_no_invoices_billable_hint(inputs)
});