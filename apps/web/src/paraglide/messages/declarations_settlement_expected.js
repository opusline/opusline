/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Settlement_ExpectedInputs */

const en_declarations_settlement_expected = /** @type {(inputs: Declarations_Settlement_ExpectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected`)
};

const fr_declarations_settlement_expected = /** @type {(inputs: Declarations_Settlement_ExpectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attendu`)
};

/**
* | output |
* | --- |
* | "Expected" |
*
* @param {Declarations_Settlement_ExpectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_settlement_expected = /** @type {((inputs?: Declarations_Settlement_ExpectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Settlement_ExpectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_settlement_expected(inputs)
	return en_declarations_settlement_expected(inputs)
});