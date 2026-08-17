/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Head_StateInputs */

const en_declarations_head_state = /** @type {(inputs: Declarations_Head_StateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`State`)
};

const fr_declarations_head_state = /** @type {(inputs: Declarations_Head_StateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`État`)
};

/**
* | output |
* | --- |
* | "State" |
*
* @param {Declarations_Head_StateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_head_state = /** @type {((inputs?: Declarations_Head_StateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Head_StateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_head_state(inputs)
	return en_declarations_head_state(inputs)
});