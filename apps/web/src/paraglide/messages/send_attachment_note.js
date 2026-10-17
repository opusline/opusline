/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_Attachment_NoteInputs */

const en_send_attachment_note = /** @type {(inputs: Send_Attachment_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The PDF goes as an attachment. The template is set in E-mails.`)
};

const fr_send_attachment_note = /** @type {(inputs: Send_Attachment_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le PDF part en pièce jointe. Le modèle se règle dans E-mails.`)
};

/**
* | output |
* | --- |
* | "The PDF goes as an attachment. The template is set in E-mails." |
*
* @param {Send_Attachment_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_attachment_note = /** @type {((inputs?: Send_Attachment_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Attachment_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_attachment_note(inputs)
	return en_send_attachment_note(inputs)
});