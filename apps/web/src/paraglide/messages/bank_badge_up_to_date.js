/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Badge_Up_To_DateInputs */

const en_bank_badge_up_to_date = /** @type {(inputs: Bank_Badge_Up_To_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Up to date`)
};

const fr_bank_badge_up_to_date = /** @type {(inputs: Bank_Badge_Up_To_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À jour`)
};

/**
* | output |
* | --- |
* | "Up to date" |
*
* @param {Bank_Badge_Up_To_DateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_badge_up_to_date = /** @type {((inputs?: Bank_Badge_Up_To_DateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Badge_Up_To_DateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_badge_up_to_date(inputs)
	return en_bank_badge_up_to_date(inputs)
});