/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Instance_Backup_HowInputs */



/**
* | output |
* | --- |
* | "Run this from the directory holding compose.prod.yaml:" |
*
* @param {Instance_Backup_HowInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const instance_backup_how = /** @type {((inputs?: Instance_Backup_HowInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Instance_Backup_HowInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Lancez ceci depuis le dossier qui contient compose.prod.yaml :")
	return /** @type {LocalizedString} */ ("Run this from the directory holding compose.prod.yaml:")
});