/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Schedule_AmountInputs */

const en_missions_schedule_amount = /** @type {(inputs: Missions_Schedule_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount HT`)
};

const fr_missions_schedule_amount = /** @type {(inputs: Missions_Schedule_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant HT`)
};

/**
* | output |
* | --- |
* | "Amount HT" |
*
* @param {Missions_Schedule_AmountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_amount = /** @type {((inputs?: Missions_Schedule_AmountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_AmountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_amount(inputs)
	return en_missions_schedule_amount(inputs)
});