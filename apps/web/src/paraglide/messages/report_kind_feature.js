/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Kind_FeatureInputs */

const en_report_kind_feature = /** @type {(inputs: Report_Kind_FeatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idea`)
};

const fr_report_kind_feature = /** @type {(inputs: Report_Kind_FeatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idée`)
};

/**
* | output |
* | --- |
* | "Idea" |
*
* @param {Report_Kind_FeatureInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_kind_feature = /** @type {((inputs?: Report_Kind_FeatureInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Kind_FeatureInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_kind_feature(inputs)
	return en_report_kind_feature(inputs)
});