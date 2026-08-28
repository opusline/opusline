/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Deadline_TitleInputs */

const en_week_deadline_title = /** @type {(inputs: Week_Deadline_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next deadline`)
};

const fr_week_deadline_title = /** @type {(inputs: Week_Deadline_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prochaine échéance`)
};

/**
* | output |
* | --- |
* | "Next deadline" |
*
* @param {Week_Deadline_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_deadline_title = /** @type {((inputs?: Week_Deadline_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Deadline_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_deadline_title(inputs)
	return en_week_deadline_title(inputs)
});