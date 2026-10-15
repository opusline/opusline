/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Calendar_CopyInputs */

const en_deadlines_calendar_copy = /** @type {(inputs: Deadlines_Calendar_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy the address`)
};

const fr_deadlines_calendar_copy = /** @type {(inputs: Deadlines_Calendar_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copier l’adresse`)
};

/**
* | output |
* | --- |
* | "Copy the address" |
*
* @param {Deadlines_Calendar_CopyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_calendar_copy = /** @type {((inputs?: Deadlines_Calendar_CopyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Calendar_CopyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_calendar_copy(inputs)
	return en_deadlines_calendar_copy(inputs)
});