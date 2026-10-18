/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Beta_Feature_Reports_TitleInputs */

const en_beta_feature_reports_title = /** @type {(inputs: Beta_Feature_Reports_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reports from the app`)
};

const fr_beta_feature_reports_title = /** @type {(inputs: Beta_Feature_Reports_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signalements depuis l'application`)
};

/**
* | output |
* | --- |
* | "Reports from the app" |
*
* @param {Beta_Feature_Reports_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const beta_feature_reports_title = /** @type {((inputs?: Beta_Feature_Reports_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Beta_Feature_Reports_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_beta_feature_reports_title(inputs)
	return en_beta_feature_reports_title(inputs)
});