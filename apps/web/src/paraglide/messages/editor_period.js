/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_PeriodInputs */

const en_editor_period = /** @type {(inputs: Editor_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date or period of the service`)
};

const fr_editor_period = /** @type {(inputs: Editor_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date ou période de la prestation`)
};

/**
* | output |
* | --- |
* | "Date or period of the service" |
*
* @param {Editor_PeriodInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_period = /** @type {((inputs?: Editor_PeriodInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_PeriodInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_period(inputs)
	return en_editor_period(inputs)
});