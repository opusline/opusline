/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Interrupt_FailedInputs */



/**
* | output |
* | --- |
* | "The subscription could not be stopped." |
*
* @param {Deadlines_Interrupt_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_interrupt_failed = /** @type {((inputs?: Deadlines_Interrupt_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Interrupt_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("L'abonnement n'a pas pu être interrompu.")
	return /** @type {LocalizedString} */ ("The subscription could not be stopped.")
});