/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Long_Run_BadgeInputs */

const en_timer_long_run_badge = /** @type {(inputs: Timer_Long_Run_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Forgotten?`)
};

const fr_timer_long_run_badge = /** @type {(inputs: Timer_Long_Run_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Oublié ?`)
};

/**
* | output |
* | --- |
* | "Forgotten?" |
*
* @param {Timer_Long_Run_BadgeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_long_run_badge = /** @type {((inputs?: Timer_Long_Run_BadgeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Long_Run_BadgeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_long_run_badge(inputs)
	return en_timer_long_run_badge(inputs)
});