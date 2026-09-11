/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Session_Lock_Expired_BodyInputs */

const en_session_lock_expired_body = /** @type {(inputs: Session_Lock_Expired_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your session ended. Sign back in and the page you were on is still here.`)
};

const fr_session_lock_expired_body = /** @type {(inputs: Session_Lock_Expired_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre session a expiré. Reconnectez-vous : la page où vous étiez est toujours là.`)
};

/**
* | output |
* | --- |
* | "Your session ended. Sign back in and the page you were on is still here." |
*
* @param {Session_Lock_Expired_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const session_lock_expired_body = /** @type {((inputs?: Session_Lock_Expired_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Session_Lock_Expired_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_session_lock_expired_body(inputs)
	return en_session_lock_expired_body(inputs)
});