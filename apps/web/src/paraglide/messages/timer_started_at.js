/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ clock: NonNullable<unknown> }} Timer_Started_AtInputs */

const en_timer_started_at = /** @type {(inputs: Timer_Started_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`started ${i?.clock}`)
};

const fr_timer_started_at = /** @type {(inputs: Timer_Started_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`démarré ${i?.clock}`)
};

/**
* | output |
* | --- |
* | "started {clock}" |
*
* @param {Timer_Started_AtInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_started_at = /** @type {((inputs: Timer_Started_AtInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Started_AtInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_started_at(inputs)
	return en_timer_started_at(inputs)
});