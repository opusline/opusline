/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Calendar_Copy_FailedInputs */

const en_deadlines_calendar_copy_failed = /** @type {(inputs: Deadlines_Calendar_Copy_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The address could not be copied. Select it and copy it by hand.`)
};

const fr_deadlines_calendar_copy_failed = /** @type {(inputs: Deadlines_Calendar_Copy_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L’adresse n’a pas pu être copiée. Sélectionnez-la et copiez-la à la main.`)
};

/**
* | output |
* | --- |
* | "The address could not be copied. Select it and copy it by hand." |
*
* @param {Deadlines_Calendar_Copy_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_calendar_copy_failed = /** @type {((inputs?: Deadlines_Calendar_Copy_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Calendar_Copy_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_calendar_copy_failed(inputs)
	return en_deadlines_calendar_copy_failed(inputs)
});