/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Tracking_ExpiredInputs */

const en_quote_tracking_expired = /** @type {(inputs: Quote_Tracking_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The quote has expired. Reopen it to send it again with a new validity.`)
};

const fr_quote_tracking_expired = /** @type {(inputs: Quote_Tracking_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le devis a expiré. Rouvrez-le pour le renvoyer avec une nouvelle validité.`)
};

/**
* | output |
* | --- |
* | "The quote has expired. Reopen it to send it again with a new validity." |
*
* @param {Quote_Tracking_ExpiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_tracking_expired = /** @type {((inputs?: Quote_Tracking_ExpiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Tracking_ExpiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_tracking_expired(inputs)
	return en_quote_tracking_expired(inputs)
});