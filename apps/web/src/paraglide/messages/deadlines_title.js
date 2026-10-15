/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_TitleInputs */

const en_deadlines_title = /** @type {(inputs: Deadlines_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deadlines`)
};

const fr_deadlines_title = /** @type {(inputs: Deadlines_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Échéances`)
};

/**
* | output |
* | --- |
* | "Deadlines" |
*
* @param {Deadlines_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_title = /** @type {((inputs?: Deadlines_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_title(inputs)
	return en_deadlines_title(inputs)
});