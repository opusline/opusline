/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ line: NonNullable<unknown> }} Declarations_Copy_LineInputs */

const en_declarations_copy_line = /** @type {(inputs: Declarations_Copy_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Copy ${i?.line}`)
};

const fr_declarations_copy_line = /** @type {(inputs: Declarations_Copy_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Copier ${i?.line}`)
};

/**
* | output |
* | --- |
* | "Copy {line}" |
*
* @param {Declarations_Copy_LineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_copy_line = /** @type {((inputs: Declarations_Copy_LineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Copy_LineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_copy_line(inputs)
	return en_declarations_copy_line(inputs)
});