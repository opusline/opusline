/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Mail_Delivery_Not_ConfiguredInputs */

const en_mail_delivery_not_configured = /** @type {(inputs: Mail_Delivery_Not_ConfiguredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This instance does not send email yet. Whoever runs it turns that on by setting MAIL_MAILER and the other MAIL_* values in its .env file, then restarting it. Your choices below are saved and apply from then on.`)
};

const fr_mail_delivery_not_configured = /** @type {(inputs: Mail_Delivery_Not_ConfiguredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cette instance n'envoie pas encore d'e-mails. La personne qui l'administre l'active en renseignant MAIL_MAILER et les autres valeurs MAIL_* dans son fichier .env, puis en la redémarrant. Vos choix ci-dessous sont enregistrés et s'appliqueront dès ce moment.`)
};

/**
* | output |
* | --- |
* | "This instance does not send email yet. Whoever runs it turns that on by setting MAIL_MAILER and the other MAIL_* values in its .env file, then restarting it...." |
*
* @param {Mail_Delivery_Not_ConfiguredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const mail_delivery_not_configured = /** @type {((inputs?: Mail_Delivery_Not_ConfiguredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Mail_Delivery_Not_ConfiguredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_mail_delivery_not_configured(inputs)
	return en_mail_delivery_not_configured(inputs)
});