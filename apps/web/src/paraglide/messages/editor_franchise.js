/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_FranchiseInputs */

const en_editor_franchise = /** @type {(inputs: Editor_FranchiseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`franchise`)
};

const fr_editor_franchise = /** @type {(inputs: Editor_FranchiseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`franchise`)
};

/**
* | output |
* | --- |
* | "franchise" |
*
* @param {Editor_FranchiseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_franchise = /** @type {((inputs?: Editor_FranchiseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_FranchiseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_franchise(inputs)
	return en_editor_franchise(inputs)
});