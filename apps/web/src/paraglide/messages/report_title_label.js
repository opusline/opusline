/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Title_LabelInputs */

const en_report_title_label = /** @type {(inputs: Report_Title_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Title`)
};

const fr_report_title_label = /** @type {(inputs: Report_Title_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Titre`)
};

/**
* | output |
* | --- |
* | "Title" |
*
* @param {Report_Title_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_title_label = /** @type {((inputs?: Report_Title_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Title_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_title_label(inputs)
	return en_report_title_label(inputs)
});