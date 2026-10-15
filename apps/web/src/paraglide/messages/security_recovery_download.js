/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Recovery_DownloadInputs */

const en_security_recovery_download = /** @type {(inputs: Security_Recovery_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Download`)
};

const fr_security_recovery_download = /** @type {(inputs: Security_Recovery_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Télécharger`)
};

/**
* | output |
* | --- |
* | "Download" |
*
* @param {Security_Recovery_DownloadInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_recovery_download = /** @type {((inputs?: Security_Recovery_DownloadInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Recovery_DownloadInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_recovery_download(inputs)
	return en_security_recovery_download(inputs)
});