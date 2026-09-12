/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_History_TitleInputs */

const en_declarations_history_title = /** @type {(inputs: Declarations_History_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`History · last 6 months`)
};

const fr_declarations_history_title = /** @type {(inputs: Declarations_History_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Historique · 6 derniers mois`)
};

/**
* | output |
* | --- |
* | "History · last 6 months" |
*
* @param {Declarations_History_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_history_title = /** @type {((inputs?: Declarations_History_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_History_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_history_title(inputs)
	return en_declarations_history_title(inputs)
});