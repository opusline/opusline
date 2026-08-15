/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Discard_ConfirmInputs */

const en_timer_discard_confirm = /** @type {(inputs: Timer_Discard_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm discard`)
};

const fr_timer_discard_confirm = /** @type {(inputs: Timer_Discard_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirmer l'abandon`)
};

/**
* | output |
* | --- |
* | "Confirm discard" |
*
* @param {Timer_Discard_ConfirmInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_discard_confirm = /** @type {((inputs?: Timer_Discard_ConfirmInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Discard_ConfirmInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_discard_confirm(inputs)
	return en_timer_discard_confirm(inputs)
});