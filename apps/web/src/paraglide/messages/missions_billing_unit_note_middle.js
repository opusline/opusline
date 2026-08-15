/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Billing_Unit_Note_MiddleInputs */

const en_missions_billing_unit_note_middle = /** @type {(inputs: Missions_Billing_Unit_Note_MiddleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`for a TJM,`)
};

const fr_missions_billing_unit_note_middle = /** @type {(inputs: Missions_Billing_Unit_Note_MiddleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`pour un TJM,`)
};

/**
* | output |
* | --- |
* | "for a TJM," |
*
* @param {Missions_Billing_Unit_Note_MiddleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_billing_unit_note_middle = /** @type {((inputs?: Missions_Billing_Unit_Note_MiddleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Billing_Unit_Note_MiddleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_billing_unit_note_middle(inputs)
	return en_missions_billing_unit_note_middle(inputs)
});