/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Public_NoticeInputs */

const en_report_public_notice = /** @type {(inputs: Report_Public_NoticeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filed publicly on GitHub, without your name or email.`)
};

const fr_report_public_notice = /** @type {(inputs: Report_Public_NoticeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Publié sur GitHub, sans votre nom ni votre e-mail.`)
};

/**
* | output |
* | --- |
* | "Filed publicly on GitHub, without your name or email." |
*
* @param {Report_Public_NoticeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_public_notice = /** @type {((inputs?: Report_Public_NoticeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Public_NoticeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_public_notice(inputs)
	return en_report_public_notice(inputs)
});