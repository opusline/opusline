/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Declarations_Deadline_BeforeInputs */

const en_declarations_deadline_before = /** @type {(inputs: Declarations_Deadline_BeforeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`To file before ${i?.date}`)
};

const fr_declarations_deadline_before = /** @type {(inputs: Declarations_Deadline_BeforeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`À déclarer avant le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "To file before {date}" |
*
* @param {Declarations_Deadline_BeforeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_deadline_before = /** @type {((inputs: Declarations_Deadline_BeforeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Deadline_BeforeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_deadline_before(inputs)
	return en_declarations_deadline_before(inputs)
});