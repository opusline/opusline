/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Calendar_RotateInputs */

const en_deadlines_calendar_rotate = /** @type {(inputs: Deadlines_Calendar_RotateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Regenerate the address`)
};

const fr_deadlines_calendar_rotate = /** @type {(inputs: Deadlines_Calendar_RotateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Régénérer l'adresse`)
};

/**
* | output |
* | --- |
* | "Regenerate the address" |
*
* @param {Deadlines_Calendar_RotateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_calendar_rotate = /** @type {((inputs?: Deadlines_Calendar_RotateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Calendar_RotateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_calendar_rotate(inputs)
	return en_deadlines_calendar_rotate(inputs)
});