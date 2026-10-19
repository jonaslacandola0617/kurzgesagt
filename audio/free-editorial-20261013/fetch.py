#!/usr/bin/env python3
"""Retrieve owner-retained cues privately; do not redistribute raw source audio."""
from pathlib import Path
import argparse,hashlib,json,urllib.request,os,tempfile

def main():
 p=argparse.ArgumentParser(description=__doc__)
 p.add_argument('--ids',nargs='+',required=True,help='Catalog IDs such as SFX_FREE_001 or numbers such as 1')
 p.add_argument('--out',type=Path,required=True,help='Private directory outside this public repository')
 a=p.parse_args();repo=Path(__file__).resolve().parents[3];dest=a.out.expanduser().resolve()
 if dest==repo or repo in dest.parents:p.error('Raw third-party audio must stay outside the public repository')
 catalog=json.loads(Path(__file__).with_name('CATALOG.json').read_text())['sounds']
 byid={r['sound_id']:r for r in catalog};selected=[]
 for sid in a.ids:
  key=f'SFX_FREE_{int(sid):03d}' if sid.isdecimal() else sid
  if key not in byid:p.error('Unknown catalog ID: '+sid)
  if key not in selected:selected.append(key)
 dest.mkdir(parents=True,exist_ok=True)
 for key in selected:
  row=byid[key];target=dest/(Path(row['file_stem']).name+'.wav')
  if target.exists() and hashlib.sha256(target.read_bytes()).hexdigest()==row['original_sha256']:
   print(key,'reused');continue
  fd,temp=tempfile.mkstemp(dir=dest,suffix='.part');os.close(fd)
  try:
   urllib.request.urlretrieve(row['original_url'],temp)
   if hashlib.sha256(Path(temp).read_bytes()).hexdigest()!=row['original_sha256']:raise ValueError('Source hash changed: '+key)
   Path(temp).replace(target);print(key,'retrieved and verified')
  finally:Path(temp).unlink(missing_ok=True)

if __name__=='__main__':main()
