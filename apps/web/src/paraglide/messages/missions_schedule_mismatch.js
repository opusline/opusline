/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ scheduled: NonNullable<unknown>, total: NonNullable<unknown> }} Missions_Schedule_MismatchInputs */

const en_missions_schedule_mismatch = /** @type {(inputs: Missions_Schedule_MismatchInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The instalments add up to ${i?.scheduled}, the fixed price is ${i?.total}.`)
};

const fr_missions_schedule_mismatch = /** @type {(inputs: Missions_Schedule_MismatchInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Les échéances totalisent ${i?.scheduled}, le forfait est de ${i?.total}.`)
};

/**
* | output |
* | --- |
* | "The instalments add up to {scheduled}, the fixed price is {total}." |
*
* @param {Missions_Schedule_MismatchInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_mismatch = /** @type {((inputs: Missions_Schedule_MismatchInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_MismatchInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_mismatch(inputs)
	return en_missions_schedule_mismatch(inputs)
});