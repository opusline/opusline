/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Send_AnotherInputs */

const en_report_send_another = /** @type {(inputs: Report_Send_AnotherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send another`)
};

const fr_report_send_another = /** @type {(inputs: Report_Send_AnotherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En envoyer un autre`)
};

/**
* | output |
* | --- |
* | "Send another" |
*
* @param {Report_Send_AnotherInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_send_another = /** @type {((inputs?: Report_Send_AnotherInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Send_AnotherInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_send_another(inputs)
	return en_report_send_another(inputs)
});