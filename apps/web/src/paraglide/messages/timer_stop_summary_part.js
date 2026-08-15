/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ clock: NonNullable<unknown>, missionName: NonNullable<unknown> }} Timer_Stop_Summary_PartInputs */

const en_timer_stop_summary_part = /** @type {(inputs: Timer_Stop_Summary_PartInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.clock} on ${i?.missionName}`)
};

const fr_timer_stop_summary_part = /** @type {(inputs: Timer_Stop_Summary_PartInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.clock} sur ${i?.missionName}`)
};

/**
* | output |
* | --- |
* | "{clock} on {missionName}" |
*
* @param {Timer_Stop_Summary_PartInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_stop_summary_part = /** @type {((inputs: Timer_Stop_Summary_PartInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Stop_Summary_PartInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_stop_summary_part(inputs)
	return en_timer_stop_summary_part(inputs)
});