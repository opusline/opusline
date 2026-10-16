/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Quotes_State_Refused_OnInputs */

const en_quotes_state_refused_on = /** @type {(inputs: Quotes_State_Refused_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`refused on ${i?.date}`)
};

const fr_quotes_state_refused_on = /** @type {(inputs: Quotes_State_Refused_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`refusé le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "refused on {date}" |
*
* @param {Quotes_State_Refused_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_state_refused_on = /** @type {((inputs: Quotes_State_Refused_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_State_Refused_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_state_refused_on(inputs)
	return en_quotes_state_refused_on(inputs)
});