import requests
import zipfile
import os
import io

print("=== STEP 1: Download BSEE IncInvRawData.zip ===", flush=True)
url = "https://www.data.bsee.gov/Other/Files/IncInvRawData.zip"
r = requests.get(url, timeout=60)
print(f"HTTP status: {r.status_code}", flush=True)
print(f"Bytes received: {len(r.content)}", flush=True)

dest = "d:/SIF-Precursor-AI/data/raw/bsee_incinv.zip"
with open(dest, "wb") as f:
    f.write(r.content)
print(f"Saved: {dest}", flush=True)
print(f"Size on disk: {os.path.getsize(dest)} bytes", flush=True)

print("\n=== STEP 2: Inspect ZIP contents ===", flush=True)
z = zipfile.ZipFile(dest)
for info in z.infolist():
    print(f"  {info.filename}  compressed={info.compress_size}  uncompressed={info.file_size}", flush=True)

print("\n=== STEP 3: Extract ===", flush=True)
z.extractall("d:/SIF-Precursor-AI/data/raw/bsee_extracted/")
print("Extracted to data/raw/bsee_extracted/", flush=True)

print("\n=== STEP 4: List extracted files ===", flush=True)
ext_dir = "d:/SIF-Precursor-AI/data/raw/bsee_extracted/"
for fname in os.listdir(ext_dir):
    fpath = os.path.join(ext_dir, fname)
    print(f"  {fname}  {os.path.getsize(fpath)} bytes", flush=True)

print("\n=== STEP 5: Read and inspect the data file ===", flush=True)
# Try reading with different delimiters
import pandas as pd

for fname in os.listdir(ext_dir):
    fpath = os.path.join(ext_dir, fname)
    print(f"\nReading: {fname}", flush=True)
    # Try pipe-delimited first, then comma
    for sep in ["|", ",", "\t"]:
        try:
            df = pd.read_csv(fpath, sep=sep, encoding="latin-1", low_memory=False)
            if len(df.columns) > 2:
                print(f"  Delimiter '{sep}' worked. Rows: {len(df)}, Cols: {len(df.columns)}", flush=True)
                print(f"  Columns: {list(df.columns)}", flush=True)
                break
        except Exception as e:
            print(f"  Delimiter '{sep}' failed: {e}", flush=True)

print("\n=== STEP 6: Full column inspection ===", flush=True)
print(f"Shape: {df.shape}", flush=True)
print("\nMissing values:", flush=True)
print(df.isna().sum().to_string(), flush=True)

print("\nDuplicate rows:", df.duplicated().sum(), flush=True)

print("\nValue counts per column:", flush=True)
for col in df.columns:
    vc = df[col].value_counts()
    print(f"\n  {col} ({df[col].dtype}) — {df[col].isna().sum()} nulls — {vc.shape[0]} unique values", flush=True)
    print(vc.head(10).to_string(), flush=True)

print("\n=== STEP 7: Sample rows ===", flush=True)
print(df.head(5).to_string(), flush=True)

print("\n=== DONE ===", flush=True)
