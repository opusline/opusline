/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Dialog_TitleInputs */

const en_deadlines_dialog_title = /** @type {(inputs: Deadlines_Dialog_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subscribe to the calendar`)
};

const fr_deadlines_dialog_title = /** @type {(inputs: Deadlines_Dialog_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`S'abonner au calendrier`)
};

/**
* | output |
* | --- |
* | "Subscribe to the calendar" |
*
* @param {Deadlines_Dialog_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_dialog_title = /** @type {((inputs?: Deadlines_Dialog_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Dialog_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_dialog_title(inputs)
	return en_deadlines_dialog_title(inputs)
});