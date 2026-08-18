/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_No_Invoices_Forfait_HintInputs */

const en_missions_no_invoices_forfait_hint = /** @type {(inputs: Missions_No_Invoices_Forfait_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No invoice on this fixed price yet. Record the first one when you issue it.`)
};

const fr_missions_no_invoices_forfait_hint = /** @type {(inputs: Missions_No_Invoices_Forfait_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune facture sur ce forfait pour l’instant. Enregistrez la première quand vous l’émettez.`)
};

/**
* | output |
* | --- |
* | "No invoice on this fixed price yet. Record the first one when you issue it." |
*
* @param {Missions_No_Invoices_Forfait_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_no_invoices_forfait_hint = /** @type {((inputs?: Missions_No_Invoices_Forfait_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_No_Invoices_Forfait_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_no_invoices_forfait_hint(inputs)
	return en_missions_no_invoices_forfait_hint(inputs)
});