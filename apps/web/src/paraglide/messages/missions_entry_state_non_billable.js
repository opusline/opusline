/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Entry_State_Non_BillableInputs */

const en_missions_entry_state_non_billable = /** @type {(inputs: Missions_Entry_State_Non_BillableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non-billable`)
};

const fr_missions_entry_state_non_billable = /** @type {(inputs: Missions_Entry_State_Non_BillableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non facturable`)
};

/**
* | output |
* | --- |
* | "Non-billable" |
*
* @param {Missions_Entry_State_Non_BillableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_entry_state_non_billable = /** @type {((inputs?: Missions_Entry_State_Non_BillableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Entry_State_Non_BillableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_entry_state_non_billable(inputs)
	return en_missions_entry_state_non_billable(inputs)
});