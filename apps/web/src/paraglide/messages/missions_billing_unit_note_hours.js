/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Billing_Unit_Note_HoursInputs */

const en_missions_billing_unit_note_hours = /** @type {(inputs: Missions_Billing_Unit_Note_HoursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`hours`)
};

const fr_missions_billing_unit_note_hours = /** @type {(inputs: Missions_Billing_Unit_Note_HoursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`heures`)
};

/**
* | output |
* | --- |
* | "hours" |
*
* @param {Missions_Billing_Unit_Note_HoursInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_billing_unit_note_hours = /** @type {((inputs?: Missions_Billing_Unit_Note_HoursInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Billing_Unit_Note_HoursInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_billing_unit_note_hours(inputs)
	return en_missions_billing_unit_note_hours(inputs)
});