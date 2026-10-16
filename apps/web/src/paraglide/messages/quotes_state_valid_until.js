/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Quotes_State_Valid_UntilInputs */

const en_quotes_state_valid_until = /** @type {(inputs: Quotes_State_Valid_UntilInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`valid until ${i?.date}`)
};

const fr_quotes_state_valid_until = /** @type {(inputs: Quotes_State_Valid_UntilInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`valable jusqu'au ${i?.date}`)
};

/**
* | output |
* | --- |
* | "valid until {date}" |
*
* @param {Quotes_State_Valid_UntilInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_state_valid_until = /** @type {((inputs: Quotes_State_Valid_UntilInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_State_Valid_UntilInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_state_valid_until(inputs)
	return en_quotes_state_valid_until(inputs)
});