/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Tracking_Sent_OnInputs */

const en_quote_tracking_sent_on = /** @type {(inputs: Quote_Tracking_Sent_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent on`)
};

const fr_quote_tracking_sent_on = /** @type {(inputs: Quote_Tracking_Sent_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoyé le`)
};

/**
* | output |
* | --- |
* | "Sent on" |
*
* @param {Quote_Tracking_Sent_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_tracking_sent_on = /** @type {((inputs?: Quote_Tracking_Sent_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Tracking_Sent_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_tracking_sent_on(inputs)
	return en_quote_tracking_sent_on(inputs)
});