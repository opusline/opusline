/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Scope_AcceptedInputs */

const en_quotes_scope_accepted = /** @type {(inputs: Quotes_Scope_AcceptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Accepted`)
};

const fr_quotes_scope_accepted = /** @type {(inputs: Quotes_Scope_AcceptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Acceptés`)
};

/**
* | output |
* | --- |
* | "Accepted" |
*
* @param {Quotes_Scope_AcceptedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_scope_accepted = /** @type {((inputs?: Quotes_Scope_AcceptedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Scope_AcceptedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_scope_accepted(inputs)
	return en_quotes_scope_accepted(inputs)
});