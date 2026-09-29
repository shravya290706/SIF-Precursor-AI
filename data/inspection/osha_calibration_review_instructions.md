# OSHA Calibration Review: 20 Reports

This is a human calibration review artifact. The accompanying CSV contains the first 20 records from `osha_pilot_annotation_sheet.csv` in the original order. All annotation fields are intentionally blank.

Do not use `Hospitalized`, `Amputation`, `Loss of Eye`, or any other injury-outcome field. Use the narrative and event title only. Do not force a decision when the evidence is insufficient.

## Fields and allowed values

### `sif_potential`

- `SIF_POTENTIAL`: credible exposure, or narrowly avoided exposure, to a high-energy hazard with a plausible fatality or life-altering-injury pathway.
- `NOT_APPARENT`: no credible high-consequence pathway is apparent from the available report.
- `UNCERTAIN_INSUFFICIENT_EVIDENCE`: the report is too brief, vague, contradictory, or incomplete to decide.

This is a prioritization label, not a fatality prediction. Injury severity alone must not determine it.

### `primary_mechanism`

Choose the single best-supported value:

`CAUGHT_IN`, `STRUCK_BY_DROPPED_OBJECT`, `FALL_HEIGHT`, `VEHICLE_MOBILE_EQUIPMENT`, `FIRE_EXPLOSION`, `PRESSURE_STORED_ENERGY`, `CONFINED_SPACE_TOXIC`, `ELECTRICAL`, `CHEMICAL`, `ENVIRONMENTAL`, `OTHER`, `UNKNOWN`

Use `OTHER` for a clear mechanism outside the list and `UNKNOWN` when it cannot be determined.

### `energy_source`

Choose the primary source, or `MULTIPLE` when several sources are material:

`GRAVITY`, `MECHANICAL_MOTION`, `PRESSURE`, `THERMAL_FLAMMABLE`, `ELECTRICAL`, `CHEMICAL_TOXIC_ATMOSPHERE`, `VEHICLE`, `MULTIPLE`, `NONE_IDENTIFIED`, `UNKNOWN`

### `control_status`

Assess the most relevant critical control:

- `PRESENT_EFFECTIVE`: explicitly present and effective, including a control that prevented a worse outcome.
- `PRESENT_FAILED`: present but failed, bypassed, or ineffective.
- `ABSENT`: a needed control was missing or not used.
- `PARTIALLY_EFFECTIVE`: reduced exposure but did not fully prevent it.
- `UNKNOWN`: not stated or not reliably inferable.
- `NOT_APPLICABLE`: no relevant control applies.

Do not infer control failure merely because an injury occurred.

### `evidence_span`

Copy the shortest exact quote or quotes from `narrative_text` supporting the review values. Do not paraphrase or invent evidence. Leave blank when no reliable evidence is available.

### `annotator_confidence`

- `HIGH`: the mechanism, energy/control context, and decision are explicit.
- `MEDIUM`: the decision is supportable but one element requires limited interpretation.
- `LOW`: the report is vague or conflicting and the decision is provisional.

### `annotator_id`

Use the assigned reviewer identifier, preferably an anonymous project identifier.

### `review_notes`

Record brief reasoning, questions, or disagreement notes. Do not add facts absent from the report.

## Calibration discipline

Reviewers should independently identify the hazard and energy source, determine whether a person was exposed or narrowly avoided exposure, and assess the relevant control. Actual injury outcome is excluded from the decision. Calibration disagreements should be recorded for later codebook refinement; do not modify the source pilot sheet.