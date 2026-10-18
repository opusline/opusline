/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Chat_IntroInputs */

const en_report_chat_intro = /** @type {(inputs: Report_Chat_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tell Claude what went wrong or what you need. It asks what the maintainer will need, then writes the report for you to check.`)
};

const fr_report_chat_intro = /** @type {(inputs: Report_Chat_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dites à Claude ce qui ne va pas ou ce dont vous avez besoin. Il demande ce qu'il faudra au mainteneur, puis rédige le signalement que vous relisez.`)
};

/**
* | output |
* | --- |
* | "Tell Claude what went wrong or what you need. It asks what the maintainer will need, then writes the report for you to check." |
*
* @param {Report_Chat_IntroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_chat_intro = /** @type {((inputs?: Report_Chat_IntroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Chat_IntroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_chat_intro(inputs)
	return en_report_chat_intro(inputs)
});