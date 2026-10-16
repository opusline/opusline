/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Quotes_State_Expired_OnInputs */

const en_quotes_state_expired_on = /** @type {(inputs: Quotes_State_Expired_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`expired on ${i?.date}`)
};

const fr_quotes_state_expired_on = /** @type {(inputs: Quotes_State_Expired_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`expiré le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "expired on {date}" |
*
* @param {Quotes_State_Expired_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_state_expired_on = /** @type {((inputs: Quotes_State_Expired_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_State_Expired_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_state_expired_on(inputs)
	return en_quotes_state_expired_on(inputs)
});