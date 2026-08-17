/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Entry_State_BillableInputs */

const en_missions_entry_state_billable = /** @type {(inputs: Missions_Entry_State_BillableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To invoice`)
};

const fr_missions_entry_state_billable = /** @type {(inputs: Missions_Entry_State_BillableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À facturer`)
};

/**
* | output |
* | --- |
* | "To invoice" |
*
* @param {Missions_Entry_State_BillableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_entry_state_billable = /** @type {((inputs?: Missions_Entry_State_BillableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Entry_State_BillableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_entry_state_billable(inputs)
	return en_missions_entry_state_billable(inputs)
});