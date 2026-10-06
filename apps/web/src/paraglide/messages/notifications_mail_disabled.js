/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notifications_Mail_DisabledInputs */

const en_notifications_mail_disabled = /** @type {(inputs: Notifications_Mail_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This instance does not send email yet. Your choices are saved and apply as soon as its operator configures a mailer.`)
};

const fr_notifications_mail_disabled = /** @type {(inputs: Notifications_Mail_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cette instance n'envoie pas encore d'e-mails. Vos choix sont enregistrés et s'appliquent dès que son administrateur configure un serveur d'envoi.`)
};

/**
* | output |
* | --- |
* | "This instance does not send email yet. Your choices are saved and apply as soon as its operator configures a mailer." |
*
* @param {Notifications_Mail_DisabledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const notifications_mail_disabled = /** @type {((inputs?: Notifications_Mail_DisabledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notifications_Mail_DisabledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notifications_mail_disabled(inputs)
	return en_notifications_mail_disabled(inputs)
});