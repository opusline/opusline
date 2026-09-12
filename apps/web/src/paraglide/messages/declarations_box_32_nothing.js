/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Box_32_NothingInputs */

const en_declarations_box_32_nothing = /** @type {(inputs: Declarations_Box_32_NothingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`nothing to pay this month`)
};

const fr_declarations_box_32_nothing = /** @type {(inputs: Declarations_Box_32_NothingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`rien à payer ce mois`)
};

/**
* | output |
* | --- |
* | "nothing to pay this month" |
*
* @param {Declarations_Box_32_NothingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_box_32_nothing = /** @type {((inputs?: Declarations_Box_32_NothingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Box_32_NothingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_box_32_nothing(inputs)
	return en_declarations_box_32_nothing(inputs)
});