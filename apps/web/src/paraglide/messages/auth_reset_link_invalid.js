/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Reset_Link_InvalidInputs */

const en_auth_reset_link_invalid = /** @type {(inputs: Auth_Reset_Link_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This link is no longer valid: it has expired or was already used. Ask for a new one from the sign-in page.`)
};

const fr_auth_reset_link_invalid = /** @type {(inputs: Auth_Reset_Link_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce lien n'est plus valide : il a expiré ou a déjà servi. Demandez-en un nouveau depuis la page de connexion.`)
};

/**
* | output |
* | --- |
* | "This link is no longer valid: it has expired or was already used. Ask for a new one from the sign-in page." |
*
* @param {Auth_Reset_Link_InvalidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_reset_link_invalid = /** @type {((inputs?: Auth_Reset_Link_InvalidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Reset_Link_InvalidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_reset_link_invalid(inputs)
	return en_auth_reset_link_invalid(inputs)
});