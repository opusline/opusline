/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ box: NonNullable<unknown> }} Declarations_BoxInputs */

const en_declarations_box = /** @type {(inputs: Declarations_BoxInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`box ${i?.box}`)
};

const fr_declarations_box = /** @type {(inputs: Declarations_BoxInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`case ${i?.box}`)
};

/**
* | output |
* | --- |
* | "box {box}" |
*
* @param {Declarations_BoxInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_box = /** @type {((inputs: Declarations_BoxInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_BoxInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_box(inputs)
	return en_declarations_box(inputs)
});