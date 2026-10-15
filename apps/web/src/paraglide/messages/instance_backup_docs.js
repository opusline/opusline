/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Instance_Backup_DocsInputs */

const en_instance_backup_docs = /** @type {(inputs: Instance_Backup_DocsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read the backup guide`)
};

const fr_instance_backup_docs = /** @type {(inputs: Instance_Backup_DocsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lire le guide de sauvegarde`)
};

/**
* | output |
* | --- |
* | "Read the backup guide" |
*
* @param {Instance_Backup_DocsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const instance_backup_docs = /** @type {((inputs?: Instance_Backup_DocsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Instance_Backup_DocsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_instance_backup_docs(inputs)
	return en_instance_backup_docs(inputs)
});