/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Dialog_Receives_TitleInputs */

const en_deadlines_dialog_receives_title = /** @type {(inputs: Deadlines_Dialog_Receives_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What the calendar receives`)
};

const fr_deadlines_dialog_receives_title = /** @type {(inputs: Deadlines_Dialog_Receives_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce que le calendrier reçoit`)
};

/**
* | output |
* | --- |
* | "What the calendar receives" |
*
* @param {Deadlines_Dialog_Receives_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_dialog_receives_title = /** @type {((inputs?: Deadlines_Dialog_Receives_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Dialog_Receives_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_dialog_receives_title(inputs)
	return en_deadlines_dialog_receives_title(inputs)
});