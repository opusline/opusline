/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Boxes_TitleInputs */

const en_declarations_boxes_title = /** @type {(inputs: Declarations_Boxes_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Form boxes`)
};

const fr_declarations_boxes_title = /** @type {(inputs: Declarations_Boxes_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cases du formulaire`)
};

/**
* | output |
* | --- |
* | "Form boxes" |
*
* @param {Declarations_Boxes_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_boxes_title = /** @type {((inputs?: Declarations_Boxes_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Boxes_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_boxes_title(inputs)
	return en_declarations_boxes_title(inputs)
});