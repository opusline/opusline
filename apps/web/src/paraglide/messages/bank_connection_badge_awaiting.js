/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_Badge_AwaitingInputs */

const en_bank_connection_badge_awaiting = /** @type {(inputs: Bank_Connection_Badge_AwaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To complete`)
};

const fr_bank_connection_badge_awaiting = /** @type {(inputs: Bank_Connection_Badge_AwaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À compléter`)
};

/**
* | output |
* | --- |
* | "To complete" |
*
* @param {Bank_Connection_Badge_AwaitingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_badge_awaiting = /** @type {((inputs?: Bank_Connection_Badge_AwaitingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_Badge_AwaitingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_badge_awaiting(inputs)
	return en_bank_connection_badge_awaiting(inputs)
});