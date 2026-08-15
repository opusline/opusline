/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Billing_Unit_Note_BeforeInputs */

const en_missions_billing_unit_note_before = /** @type {(inputs: Missions_Billing_Unit_Note_BeforeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The billing mode sets the tracking unit:`)
};

const fr_missions_billing_unit_note_before = /** @type {(inputs: Missions_Billing_Unit_Note_BeforeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le mode de facturation fixe l'unité de saisie :`)
};

/**
* | output |
* | --- |
* | "The billing mode sets the tracking unit:" |
*
* @param {Missions_Billing_Unit_Note_BeforeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_billing_unit_note_before = /** @type {((inputs?: Missions_Billing_Unit_Note_BeforeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Billing_Unit_Note_BeforeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_billing_unit_note_before(inputs)
	return en_missions_billing_unit_note_before(inputs)
});