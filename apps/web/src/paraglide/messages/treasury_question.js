/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_QuestionInputs */

const en_treasury_question = /** @type {(inputs: Treasury_QuestionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`How much can I transfer to myself?`)
};

const fr_treasury_question = /** @type {(inputs: Treasury_QuestionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Combien je peux me virer ?`)
};

/**
* | output |
* | --- |
* | "How much can I transfer to myself?" |
*
* @param {Treasury_QuestionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_question = /** @type {((inputs?: Treasury_QuestionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_QuestionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_question(inputs)
	return en_treasury_question(inputs)
});