/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Billing_Unit_NoteInputs */



/**
* | output |
* | --- |
* | "The billing mode sets the tracking unit: <strong>days</strong> for a TJM, <strong>hours</strong> otherwise. It can still be changed later without touching pa..." |
*
* @param {Missions_Billing_Unit_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_billing_unit_note = /** @type {((inputs?: Missions_Billing_Unit_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Billing_Unit_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Le mode de facturation fixe l'unité de saisie : <strong>jours</strong> pour un TJM, <strong>heures</strong> sinon. Il reste modifiable plus tard sans toucher aux entrées passées.")
	return /** @type {LocalizedString} */ ("The billing mode sets the tracking unit: <strong>days</strong> for a TJM, <strong>hours</strong> otherwise. It can still be changed later without touching past entries.")
});