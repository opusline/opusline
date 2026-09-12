/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Declarations_Income_Tax_Coherence_CountInputs */

const en_declarations_income_tax_coherence_count = /** @type {(inputs: Declarations_Income_Tax_Coherence_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} URSSAF declaration`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} URSSAF declarations`);
	return /** @type {LocalizedString} */ ("declarations_income_tax_coherence_count");
};

const fr_declarations_income_tax_coherence_count = /** @type {(inputs: Declarations_Income_Tax_Coherence_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} déclaration URSSAF`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} déclarations URSSAF`);
	return /** @type {LocalizedString} */ ("declarations_income_tax_coherence_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} URSSAF declaration" |
* | "other" | "{count} URSSAF declarations" |
*
* @param {Declarations_Income_Tax_Coherence_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_coherence_count = /** @type {((inputs: Declarations_Income_Tax_Coherence_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_Coherence_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_coherence_count(inputs)
	return en_declarations_income_tax_coherence_count(inputs)
});