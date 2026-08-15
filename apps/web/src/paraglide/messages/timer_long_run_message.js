/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ hours: NonNullable<unknown> }} Timer_Long_Run_MessageInputs */

const en_timer_long_run_message = /** @type {(inputs: Timer_Long_Run_MessageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`This tracking has been running for ${i?.hours}. It may have been left on: correct the duration before saving.`)
};

const fr_timer_long_run_message = /** @type {(inputs: Timer_Long_Run_MessageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ce suivi tourne depuis ${i?.hours}. Il a peut-être été laissé en marche : corrigez la durée avant d'enregistrer.`)
};

/**
* | output |
* | --- |
* | "This tracking has been running for {hours}. It may have been left on: correct the duration before saving." |
*
* @param {Timer_Long_Run_MessageInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_long_run_message = /** @type {((inputs: Timer_Long_Run_MessageInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Long_Run_MessageInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_long_run_message(inputs)
	return en_timer_long_run_message(inputs)
});