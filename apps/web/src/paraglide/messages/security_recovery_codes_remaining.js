/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Security_Recovery_Codes_RemainingInputs */

const en_security_recovery_codes_remaining = /** @type {(inputs: Security_Recovery_Codes_RemainingInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} recovery code left`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} recovery codes left`);
	return /** @type {LocalizedString} */ ("security_recovery_codes_remaining");
};

const fr_security_recovery_codes_remaining = /** @type {(inputs: Security_Recovery_Codes_RemainingInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} code de secours restant`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} codes de secours restants`);
	return /** @type {LocalizedString} */ ("security_recovery_codes_remaining");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} recovery code left" |
* | "other" | "{count} recovery codes left" |
*
* @param {Security_Recovery_Codes_RemainingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_recovery_codes_remaining = /** @type {((inputs: Security_Recovery_Codes_RemainingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Recovery_Codes_RemainingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_recovery_codes_remaining(inputs)
	return en_security_recovery_codes_remaining(inputs)
});