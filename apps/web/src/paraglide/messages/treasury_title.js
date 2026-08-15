/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_TitleInputs */

const en_treasury_title = /** @type {(inputs: Treasury_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`How much can I pay myself?`)
};

const fr_treasury_title = /** @type {(inputs: Treasury_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Combien je peux me virer ?`)
};

/**
* | output |
* | --- |
* | "How much can I pay myself?" |
*
* @param {Treasury_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_title = /** @type {((inputs?: Treasury_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_title(inputs)
	return en_treasury_title(inputs)
});