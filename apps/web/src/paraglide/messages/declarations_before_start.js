/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Before_StartInputs */

const en_declarations_before_start = /** @type {(inputs: Declarations_Before_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing to declare before the business started.`)
};

const fr_declarations_before_start = /** @type {(inputs: Declarations_Before_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune activité déclarable avant le début de l'activité.`)
};

/**
* | output |
* | --- |
* | "Nothing to declare before the business started." |
*
* @param {Declarations_Before_StartInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_before_start = /** @type {((inputs?: Declarations_Before_StartInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Before_StartInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_before_start(inputs)
	return en_declarations_before_start(inputs)
});