/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Quotes_State_Accepted_OnInputs */

const en_quotes_state_accepted_on = /** @type {(inputs: Quotes_State_Accepted_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`accepted on ${i?.date}`)
};

const fr_quotes_state_accepted_on = /** @type {(inputs: Quotes_State_Accepted_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`accepté le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "accepted on {date}" |
*
* @param {Quotes_State_Accepted_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_state_accepted_on = /** @type {((inputs: Quotes_State_Accepted_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_State_Accepted_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_state_accepted_on(inputs)
	return en_quotes_state_accepted_on(inputs)
});