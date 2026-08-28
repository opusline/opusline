/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Calendar_CopiedInputs */

const en_deadlines_calendar_copied = /** @type {(inputs: Deadlines_Calendar_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Address copied.`)
};

const fr_deadlines_calendar_copied = /** @type {(inputs: Deadlines_Calendar_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adresse copiée.`)
};

/**
* | output |
* | --- |
* | "Address copied." |
*
* @param {Deadlines_Calendar_CopiedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_calendar_copied = /** @type {((inputs?: Deadlines_Calendar_CopiedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Calendar_CopiedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_calendar_copied(inputs)
	return en_deadlines_calendar_copied(inputs)
});