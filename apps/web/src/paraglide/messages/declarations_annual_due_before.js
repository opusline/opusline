/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Declarations_Annual_Due_BeforeInputs */

const en_declarations_annual_due_before = /** @type {(inputs: Declarations_Annual_Due_BeforeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`before ${i?.date}`)
};

const fr_declarations_annual_due_before = /** @type {(inputs: Declarations_Annual_Due_BeforeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`avant le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "before {date}" |
*
* @param {Declarations_Annual_Due_BeforeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_annual_due_before = /** @type {((inputs: Declarations_Annual_Due_BeforeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Annual_Due_BeforeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_annual_due_before(inputs)
	return en_declarations_annual_due_before(inputs)
});