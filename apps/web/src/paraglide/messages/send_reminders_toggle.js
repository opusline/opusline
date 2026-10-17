/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_Reminders_ToggleInputs */

const en_send_reminders_toggle = /** @type {(inputs: Send_Reminders_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Turn on for this invoice`)
};

const fr_send_reminders_toggle = /** @type {(inputs: Send_Reminders_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activer pour cette facture`)
};

/**
* | output |
* | --- |
* | "Turn on for this invoice" |
*
* @param {Send_Reminders_ToggleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_reminders_toggle = /** @type {((inputs?: Send_Reminders_ToggleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Reminders_ToggleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_reminders_toggle(inputs)
	return en_send_reminders_toggle(inputs)
});