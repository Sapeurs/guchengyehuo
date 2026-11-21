"""Verify the exact offline game, permissions, identity and signature in a built APK."""
import argparse
import hashlib
import re
import subprocess
import zipfile
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('apk', type=Path)
parser.add_argument('--sdk-root', type=Path, required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
tools = args.sdk_root / 'build-tools/35.0.0'
subprocess.run([str(tools / 'apksigner'), 'verify', str(args.apk)], check=True)
badging = subprocess.check_output([str(tools / 'aapt'), 'dump', 'badging', str(args.apk)], text=True)
assert "name='com.sapeurs.guchengyehuo'" in badging
assert "versionCode='2600'" in badging and "versionName='0.26.0'" in badging
assert "sdkVersion:'26'" in badging and "targetSdkVersion:'35'" in badging
assert 'uses-permission:' not in badging, 'offline game needs no permissions'
manifest = subprocess.check_output([str(tools / 'aapt'), 'dump', 'xmltree', str(args.apk), 'AndroidManifest.xml'], text=True)
assert not re.search(r'android:debuggable.*0xffffffff', manifest), 'release must not be debuggable'
with zipfile.ZipFile(args.apk) as package:
    assets = {n[7:] for n in package.namelist() if n.startswith('assets/') and not n.endswith('/')}
    files = {str(p.relative_to(root / 'dist')): p for p in (root / 'dist').rglob('*') if p.is_file()}
    assert assets == set(files), (set(files) - assets, assets - set(files))
    for name, path in files.items():
        assert hashlib.sha256(path.read_bytes()).digest() == hashlib.sha256(package.read('assets/' + name)).digest(), name
    assert not any(n.endswith('.so') for n in package.namelist()), 'native ABI restriction'
print(f'PASS: signature, release identity, zero permissions, {len(files)} exact offline files, no ABI restriction')
print('SHA256:', hashlib.sha256(args.apk.read_bytes()).hexdigest())
