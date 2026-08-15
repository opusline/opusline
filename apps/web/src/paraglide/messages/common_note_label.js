/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Note_LabelInputs */

const en_common_note_label = /** @type {(inputs: Common_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Note`)
};

const fr_common_note_label = /** @type {(inputs: Common_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Note`)
};

/**
* | output |
* | --- |
* | "Note" |
*
* @param {Common_Note_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_note_label = /** @type {((inputs?: Common_Note_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Note_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_note_label(inputs)
	return en_common_note_label(inputs)
});