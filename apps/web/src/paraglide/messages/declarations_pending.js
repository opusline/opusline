/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_PendingInputs */

const en_declarations_pending = /** @type {(inputs: Declarations_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To file`)
};

const fr_declarations_pending = /** @type {(inputs: Declarations_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À déclarer`)
};

/**
* | output |
* | --- |
* | "To file" |
*
* @param {Declarations_PendingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_pending = /** @type {((inputs?: Declarations_PendingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_PendingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_pending(inputs)
	return en_declarations_pending(inputs)
});