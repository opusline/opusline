/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_EditInputs */

const en_common_edit = /** @type {(inputs: Common_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit`)
};

const fr_common_edit = /** @type {(inputs: Common_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifier`)
};

/**
* | output |
* | --- |
* | "Edit" |
*
* @param {Common_EditInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_edit = /** @type {((inputs?: Common_EditInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_EditInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_edit(inputs)
	return en_common_edit(inputs)
});