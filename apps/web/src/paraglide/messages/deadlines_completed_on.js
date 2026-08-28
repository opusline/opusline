/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Deadlines_Completed_OnInputs */

const en_deadlines_completed_on = /** @type {(inputs: Deadlines_Completed_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Done on ${i?.date}`)
};

const fr_deadlines_completed_on = /** @type {(inputs: Deadlines_Completed_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Faite le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "Done on {date}" |
*
* @param {Deadlines_Completed_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_completed_on = /** @type {((inputs: Deadlines_Completed_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Completed_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_completed_on(inputs)
	return en_deadlines_completed_on(inputs)
});