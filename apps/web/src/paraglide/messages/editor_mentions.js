/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_MentionsInputs */

const en_editor_mentions = /** @type {(inputs: Editor_MentionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Additional mentions · optional`)
};

const fr_editor_mentions = /** @type {(inputs: Editor_MentionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mentions additionnelles · facultatif`)
};

/**
* | output |
* | --- |
* | "Additional mentions · optional" |
*
* @param {Editor_MentionsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_mentions = /** @type {((inputs?: Editor_MentionsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_MentionsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_mentions(inputs)
	return en_editor_mentions(inputs)
});