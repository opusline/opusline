/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Body_Label_FeatureInputs */

const en_report_body_label_feature = /** @type {(inputs: Report_Body_Label_FeatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What would help you?`)
};

const fr_report_body_label_feature = /** @type {(inputs: Report_Body_Label_FeatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Qu'est-ce qui vous aiderait ?`)
};

/**
* | output |
* | --- |
* | "What would help you?" |
*
* @param {Report_Body_Label_FeatureInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_body_label_feature = /** @type {((inputs?: Report_Body_Label_FeatureInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Body_Label_FeatureInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_body_label_feature(inputs)
	return en_report_body_label_feature(inputs)
});