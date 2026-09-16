/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Prefill_Hint_LinkInputs */

const en_declarations_prefill_hint_link = /** @type {(inputs: Declarations_Prefill_Hint_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Install it`)
};

const fr_declarations_prefill_hint_link = /** @type {(inputs: Declarations_Prefill_Hint_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L’installer`)
};

/**
* | output |
* | --- |
* | "Install it" |
*
* @param {Declarations_Prefill_Hint_LinkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_prefill_hint_link = /** @type {((inputs?: Declarations_Prefill_Hint_LinkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Prefill_Hint_LinkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_prefill_hint_link(inputs)
	return en_declarations_prefill_hint_link(inputs)
});