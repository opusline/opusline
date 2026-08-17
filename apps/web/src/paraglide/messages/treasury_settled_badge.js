/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Settled_BadgeInputs */

const en_treasury_settled_badge = /** @type {(inputs: Treasury_Settled_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`On a statement`)
};

const fr_treasury_settled_badge = /** @type {(inputs: Treasury_Settled_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sur un relevé`)
};

/**
* | output |
* | --- |
* | "On a statement" |
*
* @param {Treasury_Settled_BadgeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_settled_badge = /** @type {((inputs?: Treasury_Settled_BadgeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Settled_BadgeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_settled_badge(inputs)
	return en_treasury_settled_badge(inputs)
});