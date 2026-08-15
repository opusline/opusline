/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Default_BadgeInputs */

const en_timer_default_badge = /** @type {(inputs: Timer_Default_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Default`)
};

const fr_timer_default_badge = /** @type {(inputs: Timer_Default_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Défaut`)
};

/**
* | output |
* | --- |
* | "Default" |
*
* @param {Timer_Default_BadgeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_default_badge = /** @type {((inputs?: Timer_Default_BadgeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Default_BadgeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_default_badge(inputs)
	return en_timer_default_badge(inputs)
});