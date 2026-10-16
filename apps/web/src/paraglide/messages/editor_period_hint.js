/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Period_HintInputs */

const en_editor_period_hint = /** @type {(inputs: Editor_Period_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mandatory mention, printed under the issue date.`)
};

const fr_editor_period_hint = /** @type {(inputs: Editor_Period_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mention obligatoire, reprise sous la date d'émission.`)
};

/**
* | output |
* | --- |
* | "Mandatory mention, printed under the issue date." |
*
* @param {Editor_Period_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_period_hint = /** @type {((inputs?: Editor_Period_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Period_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_period_hint(inputs)
	return en_editor_period_hint(inputs)
});