from pathlib import Path
import subprocess,json,hashlib
from concurrent.futures import ThreadPoolExecutor,as_completed
def validate_chunk(p,expected):
 q=subprocess.run(['ffprobe','-v','error','-count_frames','-select_streams','v:0','-show_entries','stream=nb_read_frames','-of','json',str(p)],capture_output=True,text=True)
 try:return q.returncode==0 and int(json.loads(q.stdout)['streams'][0]['nb_read_frames'])==expected
 except (ValueError,KeyError,IndexError):return False

r=Path(__file__).parent;t=json.loads((r/'timeline.json').read_text());c=r/'preview-chunks';c.mkdir(exist_ok=True);w=720;sig=hashlib.sha256(b''.join((r/f).read_bytes()for f in ['render.cjs','scene-core.cjs','timeline.json'])+str(w).encode()).hexdigest()
def run(start):
 end=min(start+45,t['frames']);p=c/f'{start:04}-{end:04}-{w}.mp4';receipt=p.with_suffix('.json')
 valid=p.exists()and receipt.exists()and json.loads(receipt.read_text()).get('source')==sig and json.loads(receipt.read_text()).get('sha256')==hashlib.sha256(p.read_bytes()).hexdigest() and validate_chunk(p,end-start)
 if not valid:
  subprocess.run(['node',str(r/'render.cjs'),'worker',str(start),str(end),str(w),str(p)],check=True)
  assert validate_chunk(p,end-start),f'Incomplete chunk: {p}'
  receipt.write_text(json.dumps({'start':start,'end_exclusive':end,'source':sig,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}))
 return json.loads(receipt.read_text())
records=[]
with ThreadPoolExecutor(max_workers=4)as ex:
 for f in as_completed([ex.submit(run,s)for s in range(0,t['frames'],45)]):
  records.append(f.result());count=sum(x['end_exclusive']-x['start']for x in records);(r/'PREVIEW_PROGRESS.json').write_text(json.dumps({'frames_done':count,'frames_total':t['frames'],'source':sig,'chunks':sorted(records,key=lambda x:x['start'])},indent=2));print(f'{count}/{t["frames"]} frames',flush=True)
concat=c/'concat.txt';concat.write_text(''.join("file '"+str((c/f'{s:04}-{min(s+45,t["frames"]):04}-{w}.mp4').resolve())+"'\n"for s in range(0,t['frames'],45)))
p=r/'Cold_Metal_Full_Review_720.mp4';subprocess.run(['ffmpeg','-nostdin','-y','-v','error','-xerror','-f','concat','-safe','0','-i',str(concat),'-i',str(r/'audio/mix.wav'),'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-t',str(t['duration']),'-movflags','+faststart',str(p)],check=True);print(p,flush=True)
