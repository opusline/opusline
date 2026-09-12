/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Deadline_EditInputs */

const en_declarations_deadline_edit = /** @type {(inputs: Declarations_Deadline_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`edit`)
};

const fr_declarations_deadline_edit = /** @type {(inputs: Declarations_Deadline_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`modifier`)
};

/**
* | output |
* | --- |
* | "edit" |
*
* @param {Declarations_Deadline_EditInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_deadline_edit = /** @type {((inputs?: Declarations_Deadline_EditInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Deadline_EditInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_deadline_edit(inputs)
	return en_declarations_deadline_edit(inputs)
});