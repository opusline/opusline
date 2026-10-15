/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Upload_FinishingInputs */

const en_upload_finishing = /** @type {(inputs: Upload_FinishingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filing it…`)
};

const fr_upload_finishing = /** @type {(inputs: Upload_FinishingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Classement en cours…`)
};

/**
* | output |
* | --- |
* | "Filing it…" |
*
* @param {Upload_FinishingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const upload_finishing = /** @type {((inputs?: Upload_FinishingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Upload_FinishingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_upload_finishing(inputs)
	return en_upload_finishing(inputs)
});