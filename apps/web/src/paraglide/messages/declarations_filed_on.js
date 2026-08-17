/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Declarations_Filed_OnInputs */

const en_declarations_filed_on = /** @type {(inputs: Declarations_Filed_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Filed ${i?.date}`)
};

const fr_declarations_filed_on = /** @type {(inputs: Declarations_Filed_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Déclarée le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "Filed {date}" |
*
* @param {Declarations_Filed_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_filed_on = /** @type {((inputs: Declarations_Filed_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Filed_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_filed_on(inputs)
	return en_declarations_filed_on(inputs)
});