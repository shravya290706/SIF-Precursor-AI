import pandas as pd
import os

print("=== STEP 1: Load full OSHA CSV ===", flush=True)
csv_path = "d:/SIF-Precursor-AI/data/raw/January2015toNovember2025.csv"
df = pd.read_csv(csv_path, low_memory=False)
print(f"Total rows: {len(df)}", flush=True)
print(f"Columns: {list(df.columns)}", flush=True)
print(f"CSV size on disk: {os.path.getsize(csv_path)/1024/1024:.2f} MB", flush=True)

print("\n=== STEP 2: NAICS inspection ===", flush=True)
naics = df["Primary NAICS"].fillna("").astype(str)
print(f"NAICS nulls: {df['Primary NAICS'].isna().sum()}", flush=True)
print(f"Sample NAICS values: {naics.head(5).tolist()}", flush=True)

print("\n=== STEP 3: Filter to O&G NAICS 211/213/324 ===", flush=True)
mask = naics.str.startswith("211") | naics.str.startswith("213") | naics.str.startswith("324")
filtered = df[mask].copy()
print(f"Filtered rows: {len(filtered)}", flush=True)
print("\nNAICS distribution in filtered set:", flush=True)
print(filtered["Primary NAICS"].value_counts().to_string(), flush=True)

print("\n=== STEP 4: Narrative inspection ===", flush=True)
narr_col = "Final Narrative"
print(f"Narrative nulls: {filtered[narr_col].isna().sum()}", flush=True)
print(f"Narrative empty strings: {(filtered[narr_col].fillna('').str.strip() == '').sum()}", flush=True)
narr_lengths = filtered[narr_col].fillna("").str.len()
print(f"Narrative length - min: {narr_lengths.min()}, max: {narr_lengths.max()}, mean: {narr_lengths.mean():.0f}", flush=True)

print("\n=== STEP 5: Severity fields ===", flush=True)
for col in ["Hospitalized", "Amputation", "Loss of Eye"]:
    print(f"{col}: {filtered[col].value_counts().to_dict()}", flush=True)

print("\n=== STEP 6: Event types (top 20) ===", flush=True)
print(filtered["EventTitle"].value_counts().head(20).to_string(), flush=True)

print("\n=== STEP 7: Duplicate check ===", flush=True)
dupe_id = filtered["ID"].duplicated().sum()
dupe_narr = filtered[narr_col].fillna("").duplicated().sum()
print(f"Duplicate IDs: {dupe_id}", flush=True)
print(f"Duplicate narratives (exact): {dupe_narr}", flush=True)

print("\n=== STEP 8: Missing values per column ===", flush=True)
print(filtered.isna().sum().to_string(), flush=True)

print("\n=== STEP 9: Sample narratives (5 random) ===", flush=True)
samples = filtered[narr_col].dropna().sample(5, random_state=42).tolist()
for i, s in enumerate(samples, 1):
    print(f"\n--- Sample {i} ---", flush=True)
    print(s[:500], flush=True)

print("\n=== STEP 10: Save filtered dataset ===", flush=True)
out_path = "d:/SIF-Precursor-AI/data/processed/osha_sir_og_filtered.csv"
filtered.to_csv(out_path, index=False)
print(f"Saved: {out_path}", flush=True)
print(f"Filtered file size: {os.path.getsize(out_path)/1024/1024:.2f} MB", flush=True)

print("\n=== STEP 11: Delete full extracted CSV ===", flush=True)
os.remove(csv_path)
if not os.path.exists(csv_path):
    print(f"Confirmed deleted: {csv_path}", flush=True)

print("\n=== DONE ===", flush=True)
