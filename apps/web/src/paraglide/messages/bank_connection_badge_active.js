/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_Badge_ActiveInputs */

const en_bank_connection_badge_active = /** @type {(inputs: Bank_Connection_Badge_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connected`)
};

const fr_bank_connection_badge_active = /** @type {(inputs: Bank_Connection_Badge_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connectée`)
};

/**
* | output |
* | --- |
* | "Connected" |
*
* @param {Bank_Connection_Badge_ActiveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_badge_active = /** @type {((inputs?: Bank_Connection_Badge_ActiveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_Badge_ActiveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_badge_active(inputs)
	return en_bank_connection_badge_active(inputs)
});