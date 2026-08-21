/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Personal_HeadingInputs */

const en_documents_personal_heading = /** @type {(inputs: Documents_Personal_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My administrative pieces`)
};

const fr_documents_personal_heading = /** @type {(inputs: Documents_Personal_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mes pièces administratives`)
};

/**
* | output |
* | --- |
* | "My administrative pieces" |
*
* @param {Documents_Personal_HeadingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_personal_heading = /** @type {((inputs?: Documents_Personal_HeadingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Personal_HeadingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_personal_heading(inputs)
	return en_documents_personal_heading(inputs)
});