/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Billing_Unit_Note_AfterInputs */

const en_missions_billing_unit_note_after = /** @type {(inputs: Missions_Billing_Unit_Note_AfterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`otherwise. It can still be changed later without touching past entries.`)
};

const fr_missions_billing_unit_note_after = /** @type {(inputs: Missions_Billing_Unit_Note_AfterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`sinon. Il reste modifiable plus tard sans toucher aux entrées passées.`)
};

/**
* | output |
* | --- |
* | "otherwise. It can still be changed later without touching past entries." |
*
* @param {Missions_Billing_Unit_Note_AfterInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_billing_unit_note_after = /** @type {((inputs?: Missions_Billing_Unit_Note_AfterInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Billing_Unit_Note_AfterInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_billing_unit_note_after(inputs)
	return en_missions_billing_unit_note_after(inputs)
});