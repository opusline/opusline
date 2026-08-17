/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Head_DueInputs */

const en_declarations_head_due = /** @type {(inputs: Declarations_Head_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Due`)
};

const fr_declarations_head_due = /** @type {(inputs: Declarations_Head_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Échéance`)
};

/**
* | output |
* | --- |
* | "Due" |
*
* @param {Declarations_Head_DueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_head_due = /** @type {((inputs?: Declarations_Head_DueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Head_DueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_head_due(inputs)
	return en_declarations_head_due(inputs)
});