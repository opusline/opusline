/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Entry_State_InvoicedInputs */

const en_missions_entry_state_invoiced = /** @type {(inputs: Missions_Entry_State_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoiced`)
};

const fr_missions_entry_state_invoiced = /** @type {(inputs: Missions_Entry_State_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturé`)
};

/**
* | output |
* | --- |
* | "Invoiced" |
*
* @param {Missions_Entry_State_InvoicedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_entry_state_invoiced = /** @type {((inputs?: Missions_Entry_State_InvoicedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Entry_State_InvoicedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_entry_state_invoiced(inputs)
	return en_missions_entry_state_invoiced(inputs)
});