#!/usr/bin/env python3
"""Offline pre-render gate: verify frozen bytes and review records, never artistic merit."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import sys

REQUIRED_ROLES = {'story', 'research', 'sequence', 'source', 'asset', 'font', 'voice',
                  'mix', 'captions', 'finishing', 'ending', 'requirements', 'preview'}
GATES = ('facts_rights', 'owner_art_sequence', 'owner_motion', 'owner_full_preview',
         'phone_captions', 'audio_listening_tail', 'technical_preflight', 'restore_rehearsal')
PILOT_IDS = frozenset({'cold-metal-pilot', 'recorded-voice-pilot', 'mint-cold-pilot',
                       'onion-tears-pilot', 'knuckle-pop-pilot'})
OWNER_GATES = {'owner_art_sequence', 'owner_motion', 'owner_full_preview'}

def digest(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as f:
        for block in iter(lambda: f.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()

def fingerprint(items, settings):
    return hashlib.sha256(json.dumps({'inputs': sorted(
        (i['path'], i['sha256'], i['role']) for i in items), 'settings': settings},
        sort_keys=True, separators=(',', ':')).encode()).hexdigest()

def engine_inputs(episode, project):
    """Known v1 renderer dependency closure; extra adapters must list extra files."""
    episode, project = Path(episode).resolve(), Path(project).resolve()
    engine = Path(__file__).resolve().parent
    c = json.loads((episode / 'episode.json').read_text())
    paths = {episode / 'episode.json', episode / c['data_loader']}
    paths.update(episode / n for n in c['scripts'])
    for key in ('sequence_contract', 'finishing_contract', 'motion_review_targets'):
        if c.get(key): paths.add(episode / c[key])
    for key in ('contract', 'runtime_proof'):
        if c.get('finishing', {}).get(key): paths.add(episode / c['finishing'][key])
    paths.update(project / 'assets' / n for n in list(c['images'].values()) +
                 c['data_files'] + [c['mix'], c['voice']] + [f['file'] for f in c['fonts']])
    paths.update(p for p in engine.rglob('*') if p.is_file() and
                 '__pycache__' not in p.parts and p.suffix in {'.py','.js','.cjs','.json','.html','.css'})
    lock = json.loads((engine / 'requirements.lock.json').read_text())
    repo = engine.parents[1]
    paths.update(repo / n for n in lock)
    return {p.resolve() for p in paths}

def validate_package(path, episode=None, project=None):
    path = Path(path).resolve()
    m = json.loads(path.read_text())
    errors = []
    if m.get('schema') != 1: errors.append('Unsupported package schema')
    if m.get('status') != 'RENDER_READY': errors.append('Project has not reached RENDER_READY')
    inputs = m.get('inputs', [])
    if not inputs: errors.append('No frozen input bytes')
    roles = {i.get('role') for i in inputs}
    for role in sorted(REQUIRED_ROLES - roles): errors.append('Missing input role: ' + role)
    actual_paths, declared = set(), set()
    for item in inputs:
        rel = item.get('path', '')
        p = (path.parent / rel).resolve()
        if not rel or p in actual_paths:
            errors.append('Empty or duplicate input: ' + rel)
        actual_paths.add(p)
        if not p.is_file() or digest(p) != item.get('sha256'):
            errors.append('Missing or changed input: ' + rel)
        archive = item.get('archive', {})
        if archive.get('kind') == 'git':
            try:
                repo = subprocess.check_output(['git','-C',str(path.parent),'rev-parse','--show-toplevel'],text=True,stderr=subprocess.DEVNULL).strip()
                git_path = p.relative_to(repo).as_posix()
                commit = archive.get('commit', '')
                expected_url = 'the source repository' + commit + '/' + git_path
                if not (len(commit) == 40 and all(c in '0123456789abcdef' for c in commit) and
                        archive.get('url') == expected_url and archive.get('verified_at')):
                    raise ValueError('Missing pinned GitHub read-back receipt')
                saved = subprocess.check_output(['git','-C',repo,'show',commit + ':' + git_path],stderr=subprocess.DEVNULL)
                if hashlib.sha256(saved).hexdigest() != item.get('sha256'):
                    raise ValueError('Saved Git bytes differ')
            except (ValueError, subprocess.CalledProcessError):
                errors.append('Git bytes or pinned GitHub receipt missing: ' + rel)
        elif archive.get('kind') == 'github-release':
            # Receipt records a prior read-back; this offline check does not contact GitHub.
            prefix = 'the source repository'
            if not (archive.get('url','').startswith(prefix) and archive.get('verified_at') and
                    archive.get('sha256') == item.get('sha256') and p.is_file() and
                    archive.get('size') == p.stat().st_size):
                errors.append('Missing matching GitHub read-back receipt: ' + rel)
        else: errors.append('No durable GitHub archive record: ' + rel)
        if item.get('role') == 'asset' and item.get('rights_status') != 'cleared':
            errors.append('Uncleared asset rights: ' + rel)
        declared.add(rel)
    settings = m.get('settings', {})
    approved = [{'width':w, 'height':h, 'fps':30, 'visual_style':'image-led',
                 'material_profile':'image-led-v1', 'brand_ending':'brand-ending-v1'}
                for w,h in [(1080,1920),(2160,3840)]]
    if settings not in approved:
        errors.append('Delivery settings must be native 1080p/30 or explicitly requested 4K/30')
    try: current = fingerprint(inputs, settings)
    except KeyError: current = ''; errors.append('Malformed frozen input record')
    if not current or m.get('frozen_fingerprint') != current:
        errors.append('Frozen fingerprint missing or changed')
    for name in GATES:
        g = m.get('gates', {}).get(name, {})
        if not (g.get('status') == 'approved' and g.get('date') and
                g.get('reviewer') and g.get('evidence_path') in declared and g.get('fingerprint') == current):
            errors.append('Missing or stale review record: ' + name)
        if name in OWNER_GATES and g.get('reviewer') != 'owner':
            errors.append('Owner decision required: ' + name)
    if m.get('unresolved_findings') != []: errors.append('Unresolved findings block render')
    if episode is None or project is None:
        errors.append('Provide episode and restored project to verify renderer dependency closure')
    else:
        try:
            c = json.loads((Path(episode) / 'episode.json').read_text())
            bound = (Path(episode) / c.get('pre_render_manifest', '')).resolve()
            if bound != path: errors.append('Episode does not bind this pre-render manifest')
            if c.get('id') != m.get('episode_id'): errors.append('Episode ID mismatch')
            for p in sorted(engine_inputs(episode, project) - actual_paths):
                errors.append('Unlisted renderer dependency: ' + str(p))
        except (KeyError, OSError, ValueError) as e: errors.append('Dependency inspection failed: ' + str(e))
    return {'episode_id':m.get('episode_id'), 'ready':not errors, 'errors':errors,
            'fingerprint':current, 'scope':'Offline byte/record checks; not artistic approval or live remote availability'}

def require_ready(path, episode, project):
    report = validate_package(path, episode, project)
    if not report['ready']:
        raise ValueError('Pre-render blocked: ' + '; '.join(report['errors']))
    return report

def main():
    a = argparse.ArgumentParser(description=__doc__)
    a.add_argument('manifest'); a.add_argument('--episode'); a.add_argument('--project')
    args = a.parse_args()
    try: report = validate_package(args.manifest, args.episode, args.project)
    except (OSError, ValueError, TypeError, KeyError) as e:
        report = {'ready':False,'errors':[str(e)]}
    print(json.dumps(report, indent=2)); return 0 if report['ready'] else 1

if __name__ == '__main__': sys.exit(main())
