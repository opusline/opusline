/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Schedule_Load_FailedInputs */

const en_missions_schedule_load_failed = /** @type {(inputs: Missions_Schedule_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The payment schedule could not be loaded. Try again in a moment.`)
};

const fr_missions_schedule_load_failed = /** @type {(inputs: Missions_Schedule_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L’échéancier n’a pas pu être chargé. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The payment schedule could not be loaded. Try again in a moment." |
*
* @param {Missions_Schedule_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_load_failed = /** @type {((inputs?: Missions_Schedule_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_load_failed(inputs)
	return en_missions_schedule_load_failed(inputs)
});