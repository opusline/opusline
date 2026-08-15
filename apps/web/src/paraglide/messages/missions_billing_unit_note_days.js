/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Billing_Unit_Note_DaysInputs */

const en_missions_billing_unit_note_days = /** @type {(inputs: Missions_Billing_Unit_Note_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`days`)
};

const fr_missions_billing_unit_note_days = /** @type {(inputs: Missions_Billing_Unit_Note_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`jours`)
};

/**
* | output |
* | --- |
* | "days" |
*
* @param {Missions_Billing_Unit_Note_DaysInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_billing_unit_note_days = /** @type {((inputs?: Missions_Billing_Unit_Note_DaysInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Billing_Unit_Note_DaysInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_billing_unit_note_days(inputs)
	return en_missions_billing_unit_note_days(inputs)
});