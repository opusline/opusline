/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ email: NonNullable<unknown> }} Editor_Show_EmailInputs */

const en_editor_show_email = /** @type {(inputs: Editor_Show_EmailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Show my e-mail (${i?.email})`)
};

const fr_editor_show_email = /** @type {(inputs: Editor_Show_EmailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Afficher mon e-mail (${i?.email})`)
};

/**
* | output |
* | --- |
* | "Show my e-mail ({email})" |
*
* @param {Editor_Show_EmailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_show_email = /** @type {((inputs: Editor_Show_EmailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Show_EmailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_show_email(inputs)
	return en_editor_show_email(inputs)
});