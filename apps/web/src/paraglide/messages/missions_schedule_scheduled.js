/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Schedule_ScheduledInputs */

const en_missions_schedule_scheduled = /** @type {(inputs: Missions_Schedule_ScheduledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scheduled`)
};

const fr_missions_schedule_scheduled = /** @type {(inputs: Missions_Schedule_ScheduledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Planifié`)
};

/**
* | output |
* | --- |
* | "Scheduled" |
*
* @param {Missions_Schedule_ScheduledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_scheduled = /** @type {((inputs?: Missions_Schedule_ScheduledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_ScheduledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_scheduled(inputs)
	return en_missions_schedule_scheduled(inputs)
});