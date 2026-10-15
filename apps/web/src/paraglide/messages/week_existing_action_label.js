/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Existing_Action_LabelInputs */

const en_week_existing_action_label = /** @type {(inputs: Week_Existing_Action_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What to do with the existing entry`)
};

const fr_week_existing_action_label = /** @type {(inputs: Week_Existing_Action_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Que faire de l'entrée existante`)
};

/**
* | output |
* | --- |
* | "What to do with the existing entry" |
*
* @param {Week_Existing_Action_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_existing_action_label = /** @type {((inputs?: Week_Existing_Action_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Existing_Action_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_existing_action_label(inputs)
	return en_week_existing_action_label(inputs)
});