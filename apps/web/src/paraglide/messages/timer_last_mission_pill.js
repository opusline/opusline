/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Last_Mission_PillInputs */

const en_timer_last_mission_pill = /** @type {(inputs: Timer_Last_Mission_PillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`latest`)
};

const fr_timer_last_mission_pill = /** @type {(inputs: Timer_Last_Mission_PillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`dernière`)
};

/**
* | output |
* | --- |
* | "latest" |
*
* @param {Timer_Last_Mission_PillInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_last_mission_pill = /** @type {((inputs?: Timer_Last_Mission_PillInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Last_Mission_PillInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_last_mission_pill(inputs)
	return en_timer_last_mission_pill(inputs)
});