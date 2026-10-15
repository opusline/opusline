/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Deadline_Edit_AriaInputs */

const en_declarations_deadline_edit_aria = /** @type {(inputs: Declarations_Deadline_Edit_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit the deadline settings`)
};

const fr_declarations_deadline_edit_aria = /** @type {(inputs: Declarations_Deadline_Edit_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifier les réglages d'échéance`)
};

/**
* | output |
* | --- |
* | "Edit the deadline settings" |
*
* @param {Declarations_Deadline_Edit_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_deadline_edit_aria = /** @type {((inputs?: Declarations_Deadline_Edit_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Deadline_Edit_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_deadline_edit_aria(inputs)
	return en_declarations_deadline_edit_aria(inputs)
});