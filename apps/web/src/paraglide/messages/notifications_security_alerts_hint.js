/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notifications_Security_Alerts_HintInputs */

const en_notifications_security_alerts_hint = /** @type {(inputs: Notifications_Security_Alerts_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`When your password or sign-in email changes, when two-step verification or a passkey is added or removed, when a browser is trusted, and when a recovery code is used or the set replaced. Turning this off sends one last alert.`)
};

const fr_notifications_security_alerts_hint = /** @type {(inputs: Notifications_Security_Alerts_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quand votre mot de passe ou votre adresse e-mail de connexion change, quand la vérification en deux étapes ou une clé d'accès est ajoutée ou retirée, quand un navigateur devient de confiance, et quand un code de secours est utilisé ou le jeu remplacé. Désactiver cette option envoie une dernière alerte.`)
};

/**
* | output |
* | --- |
* | "When your password or sign-in email changes, when two-step verification or a passkey is added or removed, when a browser is trusted, and when a recovery code..." |
*
* @param {Notifications_Security_Alerts_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const notifications_security_alerts_hint = /** @type {((inputs?: Notifications_Security_Alerts_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notifications_Security_Alerts_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notifications_security_alerts_hint(inputs)
	return en_notifications_security_alerts_hint(inputs)
});