/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Pending_BadgeInputs */

const en_treasury_pending_badge = /** @type {(inputs: Treasury_Pending_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awaiting statement`)
};

const fr_treasury_pending_badge = /** @type {(inputs: Treasury_Pending_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En attente de relevé`)
};

/**
* | output |
* | --- |
* | "Awaiting statement" |
*
* @param {Treasury_Pending_BadgeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_pending_badge = /** @type {((inputs?: Treasury_Pending_BadgeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Pending_BadgeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_pending_badge(inputs)
	return en_treasury_pending_badge(inputs)
});