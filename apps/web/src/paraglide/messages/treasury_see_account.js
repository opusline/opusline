/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_See_AccountInputs */

const en_treasury_see_account = /** @type {(inputs: Treasury_See_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`See the pro account`)
};

const fr_treasury_see_account = /** @type {(inputs: Treasury_See_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Voir le compte pro`)
};

/**
* | output |
* | --- |
* | "See the pro account" |
*
* @param {Treasury_See_AccountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_see_account = /** @type {((inputs?: Treasury_See_AccountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_See_AccountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_see_account(inputs)
	return en_treasury_see_account(inputs)
});