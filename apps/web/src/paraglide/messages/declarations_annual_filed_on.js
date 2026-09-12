/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Declarations_Annual_Filed_OnInputs */

const en_declarations_annual_filed_on = /** @type {(inputs: Declarations_Annual_Filed_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`filed on ${i?.date}`)
};

const fr_declarations_annual_filed_on = /** @type {(inputs: Declarations_Annual_Filed_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`déclarée le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "filed on {date}" |
*
* @param {Declarations_Annual_Filed_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_annual_filed_on = /** @type {((inputs: Declarations_Annual_Filed_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Annual_Filed_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_annual_filed_on(inputs)
	return en_declarations_annual_filed_on(inputs)
});