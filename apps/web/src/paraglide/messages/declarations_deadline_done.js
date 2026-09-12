/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Declarations_Deadline_DoneInputs */

const en_declarations_deadline_done = /** @type {(inputs: Declarations_Deadline_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Due: ${i?.date}`)
};

const fr_declarations_deadline_done = /** @type {(inputs: Declarations_Deadline_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Échéance : ${i?.date}`)
};

/**
* | output |
* | --- |
* | "Due: {date}" |
*
* @param {Declarations_Deadline_DoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_deadline_done = /** @type {((inputs: Declarations_Deadline_DoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Deadline_DoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_deadline_done(inputs)
	return en_declarations_deadline_done(inputs)
});