/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Session_Lock_BodyInputs */

const en_session_lock_body = /** @type {(inputs: Session_Lock_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline locked itself while you were away. Sign back in to carry on where you left off.`)
};

const fr_session_lock_body = /** @type {(inputs: Session_Lock_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline s'est verrouillé pendant votre absence. Reconnectez-vous pour reprendre où vous en étiez.`)
};

/**
* | output |
* | --- |
* | "Opusline locked itself while you were away. Sign back in to carry on where you left off." |
*
* @param {Session_Lock_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const session_lock_body = /** @type {((inputs?: Session_Lock_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Session_Lock_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_session_lock_body(inputs)
	return en_session_lock_body(inputs)
});