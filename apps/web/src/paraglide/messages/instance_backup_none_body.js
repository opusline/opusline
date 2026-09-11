/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Instance_Backup_None_BodyInputs */

const en_instance_backup_none_body = /** @type {(inputs: Instance_Backup_None_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Three things hold your state: the database, the uploaded files, and the APP_KEY in your .env. A backup is only a backup when it holds all three, and one command takes all three at once.`)
};

const fr_instance_backup_none_body = /** @type {(inputs: Instance_Backup_None_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trois choses portent vos données : la base, les fichiers envoyés et l'APP_KEY de votre .env. Une sauvegarde n'en est une que si elle contient les trois, et une seule commande prend les trois d'un coup.`)
};

/**
* | output |
* | --- |
* | "Three things hold your state: the database, the uploaded files, and the APP_KEY in your .env. A backup is only a backup when it holds all three, and one comm..." |
*
* @param {Instance_Backup_None_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const instance_backup_none_body = /** @type {((inputs?: Instance_Backup_None_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Instance_Backup_None_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_instance_backup_none_body(inputs)
	return en_instance_backup_none_body(inputs)
});