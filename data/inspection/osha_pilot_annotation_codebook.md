# OSHA Pilot Annotation Codebook

## Purpose

This codebook is for the 240-report pilot only. The annotation sheet starts blank. Annotators must use the narrative and event title as context, but must not use `Hospitalized`, `Amputation`, `Loss of Eye`, or any other injury-outcome field to assign a label.

`SIF_POTENTIAL` means that the report describes exposure, or narrowly avoided exposure, to a high-energy hazard with a credible pathway to fatality or life-altering injury. It is a decision-support prioritization label, not a prediction of fatality.

## Annotation fields

### `osha_id`

Original OSHA record identifier. Do not change it.

### `narrative_text`

Original OSHA narrative copied from the pilot manifest. Treat as read-only source text.

### `event_title`

Original OSHA event title copied from the pilot manifest. It may provide context, but it must not override evidence in the narrative.

### `sif_potential`

Allowed values:

- `SIF_POTENTIAL`: credible high-energy exposure or narrowly avoided exposure, with a plausible fatality or life-altering-injury pathway.
- `NOT_APPARENT`: the available report describes no credible high-consequence pathway.
- `UNCERTAIN_INSUFFICIENT_EVIDENCE`: the narrative is too brief, vague, contradictory, or incomplete to decide.

Do not use injury severity, hospitalization, amputation, or loss of eye as a direct rule for this field. A minor actual injury can still be `SIF_POTENTIAL`; a severe injury without a credible high-energy pathway does not automatically receive that label.

### `primary_mechanism`

Select the single best-supported mechanism. Use `OTHER` when the mechanism is clear but outside the listed categories, and `UNKNOWN` when it cannot be determined.

- `CAUGHT_IN`: caught-in, crushing, pinching, wedging, or entanglement.
- `STRUCK_BY_DROPPED_OBJECT`: struck-by, falling object, dropped object, suspended load, or lifting event.
- `FALL_HEIGHT`: fall from height, ladder, elevated platform, derrick, roof, or open edge.
- `VEHICLE_MOBILE_EQUIPMENT`: vehicle, mobile equipment, backing, or traffic interaction.
- `FIRE_EXPLOSION`: fire, flash fire, explosion, ignition, or flammable-vapor event.
- `PRESSURE_STORED_ENERGY`: pressure release, hydraulic/pneumatic energy, unexpected movement, or other stored energy.
- `CONFINED_SPACE_TOXIC`: confined-space entry, oxygen deficiency, toxic atmosphere, or harmful-gas exposure.
- `ELECTRICAL`: electrical contact, energized equipment, arc flash, or electrical energy.
- `CHEMICAL`: chemical, corrosive, toxic substance, or chemical-reaction exposure not primarily classified as an atmosphere/confined-space event.
- `ENVIRONMENTAL`: heat, cold, weather, or other environmental exposure.
- `OTHER`: a clear mechanism not covered above.
- `UNKNOWN`: insufficient information to identify a mechanism.

### `energy_source`

Select the primary energy source implicated by the narrative. Use `MULTIPLE` when two or more sources are material and no single source is primary.

- `GRAVITY`: falling person, falling object, suspended load, or elevation-related energy.
- `MECHANICAL_MOTION`: moving machinery, rotating equipment, crushing, pinching, or entanglement.
- `PRESSURE`: pressurized fluid, gas, hydraulic, pneumatic, or stored pressure.
- `THERMAL_FLAMMABLE`: fire, explosion, flash fire, hot work, or flammable-vapor energy.
- `ELECTRICAL`: energized electrical equipment or arc flash.
- `CHEMICAL_TOXIC_ATMOSPHERE`: toxic substance, oxygen deficiency, harmful gas, or chemical atmosphere.
- `VEHICLE`: vehicle or mobile-equipment movement.
- `MULTIPLE`: multiple material energy sources.
- `NONE_IDENTIFIED`: no relevant energy source is described.
- `UNKNOWN`: the energy source cannot be determined.

### `control_status`

Record the status of the most relevant critical control. Do not infer a control failure merely because an injury occurred.

- `PRESENT_EFFECTIVE`: the control is explicitly present and effective, including a control that prevented a worse outcome.
- `PRESENT_FAILED`: the control was present but failed, was bypassed, or was not effective.
- `ABSENT`: the narrative indicates that a needed control was missing or not used.
- `PARTIALLY_EFFECTIVE`: the control reduced exposure but did not fully prevent it.
- `UNKNOWN`: control status is not stated or cannot be inferred reliably.
- `NOT_APPLICABLE`: no relevant control applies to the described scenario.

### `evidence_span`

Copy the shortest exact quote or quotes from `narrative_text` that support the assigned values. Do not paraphrase, invent, or add facts. If no reliable evidence is available, leave the span empty and use `UNCERTAIN_INSUFFICIENT_EVIDENCE` where appropriate.

### `annotator_confidence`

- `HIGH`: mechanism, energy/control context, and SIF-potential decision are explicit.
- `MEDIUM`: the decision is supportable, but one element requires limited interpretation.
- `LOW`: the report is vague or conflicting and the decision is provisional.

### `annotator_id`

Use the assigned reviewer identifier. Do not enter a personal name if an anonymous project identifier has been provided.

### `review_notes`

Brief reasoning, disagreement notes, or questions for adjudication. Do not introduce facts absent from the narrative.

## Annotation discipline

Annotators should first identify the hazard and energy source, then determine whether a person was exposed or narrowly avoided exposure, then assess the relevant control. Actual injury outcome is deliberately excluded from this decision. Ambiguous reports should remain `UNCERTAIN_INSUFFICIENT_EVIDENCE` rather than being forced into a binary class.