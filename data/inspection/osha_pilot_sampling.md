# OSHA 240-Record Pilot Sampling

## Scope

This artifact is a deterministic sampling manifest only. It contains no SIF labels, model outputs, synthetic data, or annotation decisions. The canonical source CSV was read but not modified.

Source: `data/processed/osha_sir_og_filtered.csv`

Pilot artifact: `data/inspection/osha_pilot_sample_240.csv`

## Deterministic procedure

For each record and category, the sampling rank is:

```text
SHA256("sif-pilot-v1|" + sampling_category + "|" + str(OSHA_ID))
```

Records are sorted by this hexadecimal rank and then by OSHA ID. Once selected, a record is excluded from all later categories. The source row order is not used as a sampling signal.

Event-family categories are assigned sequentially using `EventTitle` and this precedence order:

1. `event_caught_in_crush_entangle`: `caught|compressed|pinch|entangl|crush|wedged`
2. `event_falls_elevated_work`: `fall|ladder|elevat|lower level|roof`
3. `event_struck_dropped_lifting`: `struck|falling object|dislodged|crane|lifting|swinging|dropped`
4. `event_vehicle_mobile_equipment`: `vehicle|forklift|truck|motor vehicle|backing`
5. `event_fire_explosion_ignition`: `fire|explos|ignit|vapors|combust`
6. `event_chemical_toxic_confined`: `chemical|inhal|toxic|harmful|corros|poison|confined|tank|vessel`
7. `event_electrical`: `electric|arc|voltage`
8. `event_environmental_or_other`: records not assigned to one of the preceding families

Twenty records are selected from each event-family category, producing 160 records. The remaining categories are then sampled from unselected records in this order:

1. `short_or_ambiguous`: narrative length under 100 characters or an event title containing `nonclassifiable` or `unclassifiable`; 20 records
2. `apparent_low_energy`: event title containing `fall on same level`, `slip without fall`, `environmental heat`, or `exposure to cold`; 20 records
3. `keyword_positive_event_family_mismatch`: controlled screening terms appear in the event title or narrative, but the event title matches none of the eight family rules; 10 records
4. `keyword_negative`: none of the controlled screening terms appears in the event title or narrative; 10 records
5. `apparent_high_energy`: at least one controlled screening term appears in the event title or narrative; 20 records

The controlled screening terms are:

```text
pressure|pressurized|hydraulic|pneumatic|lockout|tagout|stored energy|
flash fire|explos|ignit|h2s|hydrogen sulfide|arc flash|electr|
confined space|tank|vessel|crane|suspended|falling object|caught|
amputat|line of fire
```

These rules define sampling strata only. They are not SIF labels.

## Final counts

| Sampling stratum | Records |
| --- | ---: |
| `event_caught_in_crush_entangle` | 20 |
| `event_falls_elevated_work` | 20 |
| `event_struck_dropped_lifting` | 20 |
| `event_vehicle_mobile_equipment` | 20 |
| `event_fire_explosion_ignition` | 20 |
| `event_chemical_toxic_confined` | 20 |
| `event_electrical` | 20 |
| `event_environmental_or_other` | 20 |
| `short_or_ambiguous` | 20 |
| `apparent_low_energy` | 20 |
| `apparent_high_energy` | 20 |
| `keyword_positive_event_family_mismatch` | 10 |
| `keyword_negative` | 10 |
| **Total** | **240** |

The pilot CSV contains the original OSHA ID, original narrative text, event title, narrative length, assigned sampling stratum, and deterministic sampling rank. Annotation has not started.