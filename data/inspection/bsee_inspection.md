# BSEE Incident Investigation Metadata Inspection

## Acquisition

- Source: https://www.data.bsee.gov/Other/Files/IncInvRawData.zip
- Retrieved: 2026-09-29
- Archive size: 35,574 bytes
- Archive SHA-256: `66199051164F26BC18038F6F204DBBD6B36715632D96A7017DEA9893796CABC2`
- Archive contents: `IncInvRawData/mv_acc_investigations.txt`
- Extracted table size: 174,878 bytes
- Read encoding: `latin-1` (UTF-8 decoding fails on source bytes)

## Structure and quality

- Records: 2,021
- Columns: 7
- Columns: `DATE_OCCURRED`, `MILITARY_TIME`, `LEASE_NUMBER`, `AREA_BLOCK`, `ACCIDENT_TYPE`, `PANEL_DISTRICT`, `STATUS`
- Exact duplicate rows: 0
- Invalid dates: 0
- Date range: 1995-01-04 through 2026-09-20
- Missing values: 52 `LEASE_NUMBER` values; 0 in every other column
- Unique values: 1,844 dates, 414 times, 956 leases, 953 area blocks, 556 accident types, 2 panel districts, and 2 statuses

## Distributions

Panel district:

- `DISTRICT`: 1,940
- `PANEL`: 81

Status:

- `Complete`: 2,009
- `Pending`: 12

Most common accident types:

| Accident type | Records |
| --- | ---: |
| Fire | 296 |
| Pollution | 273 |
| LTA (>3 days) - Required Evacuation | 122 |
| Injury | 71 |
| RW/JT (>3 days) - Required Evacuation | 63 |
| Crane | 56 |
| Fatality | 51 |
| Other Lifting Device | 37 |
| Fire - Injury | 32 |
| Incident >$25K - Crane | 32 |

## Interpretation and scope boundary

This BSEE file is structured incident-investigation metadata. It does not contain bulk incident narratives, so it is not suitable as the primary NLP training corpus. It may be used later for offshore-domain reference, event-type context, and supplementary trend analysis. No SIF labels, model features, or training artifacts were created during this inspection.