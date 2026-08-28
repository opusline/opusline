/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Subscribe_Confirm_FailedInputs */

const en_deadlines_subscribe_confirm_failed = /** @type {(inputs: Deadlines_Subscribe_Confirm_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The subscription could not be recorded.`)
};

const fr_deadlines_subscribe_confirm_failed = /** @type {(inputs: Deadlines_Subscribe_Confirm_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'abonnement n'a pas pu être enregistré.`)
};

/**
* | output |
* | --- |
* | "The subscription could not be recorded." |
*
* @param {Deadlines_Subscribe_Confirm_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_subscribe_confirm_failed = /** @type {((inputs?: Deadlines_Subscribe_Confirm_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Subscribe_Confirm_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_subscribe_confirm_failed(inputs)
	return en_deadlines_subscribe_confirm_failed(inputs)
});