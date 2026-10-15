/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Interrupt_FailedInputs */

const en_deadlines_interrupt_failed = /** @type {(inputs: Deadlines_Interrupt_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The subscription could not be stopped.`)
};

const fr_deadlines_interrupt_failed = /** @type {(inputs: Deadlines_Interrupt_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'abonnement n'a pas pu être interrompu.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_interrupt_failed(inputs)
	return en_deadlines_interrupt_failed(inputs)
});