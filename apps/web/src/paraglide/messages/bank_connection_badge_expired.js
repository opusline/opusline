/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_Badge_ExpiredInputs */

const en_bank_connection_badge_expired = /** @type {(inputs: Bank_Connection_Badge_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expired`)
};

const fr_bank_connection_badge_expired = /** @type {(inputs: Bank_Connection_Badge_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expirée`)
};

/**
* | output |
* | --- |
* | "Expired" |
*
* @param {Bank_Connection_Badge_ExpiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_badge_expired = /** @type {((inputs?: Bank_Connection_Badge_ExpiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_Badge_ExpiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_badge_expired(inputs)
	return en_bank_connection_badge_expired(inputs)
});