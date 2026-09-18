/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown>, year: NonNullable<unknown>, income: NonNullable<unknown>, limit: NonNullable<unknown>, parts: NonNullable<unknown> }} Declarations_Liberating_Income_ReasonInputs */

const en_declarations_liberating_income_reason = /** @type {(inputs: Declarations_Liberating_Income_ReasonInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Your ${i?.year} revenu fiscal de référence (${i?.income}) exceeds the ${i?.limit} limit for ${i?.parts} part.`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Your ${i?.year} revenu fiscal de référence (${i?.income}) exceeds the ${i?.limit} limit for ${i?.parts} parts.`);
	return /** @type {LocalizedString} */ ("declarations_liberating_income_reason");
};

const fr_declarations_liberating_income_reason = /** @type {(inputs: Declarations_Liberating_Income_ReasonInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Votre revenu fiscal de référence ${i?.year} (${i?.income}) dépasse la limite de ${i?.limit} pour ${i?.parts} part.`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Votre revenu fiscal de référence ${i?.year} (${i?.income}) dépasse la limite de ${i?.limit} pour ${i?.parts} parts.`);
	return /** @type {LocalizedString} */ ("declarations_liberating_income_reason");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Your {year} revenu fiscal de référence ({income}) exceeds the {limit} limit for {parts} part." |
* | "other" | "Your {year} revenu fiscal de référence ({income}) exceeds the {limit} limit for {parts} parts." |
*
* @param {Declarations_Liberating_Income_ReasonInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_liberating_income_reason = /** @type {((inputs: Declarations_Liberating_Income_ReasonInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Liberating_Income_ReasonInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_liberating_income_reason(inputs)
	return en_declarations_liberating_income_reason(inputs)
});