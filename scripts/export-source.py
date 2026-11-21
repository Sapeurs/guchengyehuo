#!/usr/bin/env python3
"""Export the game source, excluding host metadata, credentials and build cache."""
import subprocess
import sys
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
if len(sys.argv) != 2:
    raise SystemExit("Usage: python scripts/export-source.py /absolute/path/game-source.zip")
target = Path(sys.argv[1])
if not target.is_absolute() or target.suffix != ".zip" or target.is_relative_to(root):
    raise SystemExit("Choose an absolute .zip destination outside the checkout")
files = subprocess.check_output(["git", "ls-files", "-c", "-o", "--exclude-standard", "-z"], cwd=root).decode().split("\0")
excluded = {".git", ".openai", ".font-source", "node_modules", "dist", ".sites-runtime"}
paths = []
for name in sorted(set(filter(None, files))):
    rel = Path(name)
    if any(part in excluded or part.startswith(".sites-") or part.startswith(".env") for part in rel.parts):
        continue
    source = root / rel
    if source.is_file() and not source.is_symlink():
        paths.append(rel)
target.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for rel in paths:
        archive.write(root / rel, "gucheng-nightfire/" + rel.as_posix())
with zipfile.ZipFile(target) as archive:
    if archive.testzip() is not None:
        raise SystemExit("Archive integrity check failed")
print(f"Exported {len(paths)} files; {target.stat().st_size} bytes: {target}")
