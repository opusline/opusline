/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Stop_And_SaveInputs */

const en_timer_stop_and_save = /** @type {(inputs: Timer_Stop_And_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stop and save`)
};

const fr_timer_stop_and_save = /** @type {(inputs: Timer_Stop_And_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Arrêter et enregistrer`)
};

/**
* | output |
* | --- |
* | "Stop and save" |
*
* @param {Timer_Stop_And_SaveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_stop_and_save = /** @type {((inputs?: Timer_Stop_And_SaveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Stop_And_SaveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_stop_and_save(inputs)
	return en_timer_stop_and_save(inputs)
});