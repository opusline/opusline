/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Instance_Backup_Record_NoteInputs */

const en_instance_backup_record_note = /** @type {(inputs: Instance_Backup_Record_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline only knows what the backup command reported. The archive itself lives outside the app — check it is still where this says.`)
};

const fr_instance_backup_record_note = /** @type {(inputs: Instance_Backup_Record_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline ne connaît que ce que la commande de sauvegarde lui a rapporté. L'archive vit hors de l'application — vérifiez qu'elle est toujours là où c'est indiqué.`)
};

/**
* | output |
* | --- |
* | "Opusline only knows what the backup command reported. The archive itself lives outside the app — check it is still where this says." |
*
* @param {Instance_Backup_Record_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const instance_backup_record_note = /** @type {((inputs?: Instance_Backup_Record_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Instance_Backup_Record_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_instance_backup_record_note(inputs)
	return en_instance_backup_record_note(inputs)
});