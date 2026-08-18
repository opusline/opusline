/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Schedule_TitleInputs */

const en_missions_schedule_title = /** @type {(inputs: Missions_Schedule_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payment schedule`)
};

const fr_missions_schedule_title = /** @type {(inputs: Missions_Schedule_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Échéancier`)
};

/**
* | output |
* | --- |
* | "Payment schedule" |
*
* @param {Missions_Schedule_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_title = /** @type {((inputs?: Missions_Schedule_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_title(inputs)
	return en_missions_schedule_title(inputs)
});