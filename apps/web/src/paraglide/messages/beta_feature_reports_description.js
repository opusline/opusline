/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Beta_Feature_Reports_DescriptionInputs */

const en_beta_feature_reports_description = /** @type {(inputs: Beta_Feature_Reports_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Report a bug or suggest a feature from inside Opusline. You read the report and choose what technical details go with it before it is filed publicly on GitHub.`)
};

const fr_beta_feature_reports_description = /** @type {(inputs: Beta_Feature_Reports_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signalez un bug ou proposez une fonctionnalité depuis Opusline. Vous relisez le signalement et choisissez les détails techniques joints avant qu'il soit publié sur GitHub.`)
};

/**
* | output |
* | --- |
* | "Report a bug or suggest a feature from inside Opusline. You read the report and choose what technical details go with it before it is filed publicly on GitHub." |
*
* @param {Beta_Feature_Reports_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const beta_feature_reports_description = /** @type {((inputs?: Beta_Feature_Reports_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Beta_Feature_Reports_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_beta_feature_reports_description(inputs)
	return en_beta_feature_reports_description(inputs)
});