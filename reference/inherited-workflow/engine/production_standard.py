"""Validate the owner-adopted Sun cadence contract, not creative quality."""
import json
import math
from pathlib import Path

STANDARD = 'sun-disappeared-v1'
# Existing adapters/recovered private packages keep their original build contract.
HISTORICAL_IDS = frozenset({'pig-war', 'tutorial-optics-test', 'legacy-ending-film',
    'sunlight-white', 'astronaut-height', 'recorded-voice', 'water-wrinkled-fingers',
    'cold-metal-pilot', 'recorded-voice-pilot', 'mint-cold-pilot',
    'onion-tears-pilot', 'knuckle-pop-pilot'})

def validate_standard(config, episode, actual_duration=None):
    if 'production_standard' not in config:
        if config.get('id') not in HISTORICAL_IDS:
            raise ValueError('New episodes must declare production_standard: sun-disappeared-v1')
        return {'status': 'historical declaration unchanged'}
    if config['production_standard'] != STANDARD:
        raise ValueError('Unknown production_standard')
    if (config.get('width'), config.get('height'), config.get('fps'), config.get('scene_fps')) != (1080, 1920, 30, 12):
        raise ValueError('Sun standard requires 1080x1920 / 30fps delivery / 12fps scenes')
    if config.get('brand_ending') != 'brand-ending-v1':
        raise ValueError('Sun standard requires the exact shared ending')
    root = Path(episode).resolve()
    name = config.get('motion_review_targets')
    if not isinstance(name, str) or not name:
        raise ValueError('Declare motion_review_targets')
    path = (root / name).resolve()
    if not path.is_relative_to(root):
        raise ValueError('Motion ledger must be episode-relative')
    ledger = json.loads(path.read_text())
    duration = ledger.get('duration')
    if not isinstance(duration, (int, float)) or not math.isfinite(duration) or duration <= 1.1:
        raise ValueError('Motion ledger requires finite full duration')
    if actual_duration is not None and abs(duration - actual_duration) > 1e-6:
        raise ValueError('Motion ledger duration differs from actual voice timeline')
    end = duration - 1.1
    events = ledger.get('events', [])
    if not events or events[0].get('t') != 0:
        raise ValueError('Motion ledger must start at frame zero')
    prior = -1
    times = []
    for event in events:
        t = event.get('t')
        if not isinstance(t, (int, float)) or not math.isfinite(t) or t <= prior or t >= end:
            raise ValueError('Motion operations need increasing finite times before ending')
        if not str(event.get('operation', '')).strip() or not str(event.get('understanding', '')).strip():
            raise ValueError('Each operation needs resulting understanding')
        times.append(t)
        prior = t
    intervals = list(zip(times, times[1:] + [end]))
    used = []
    for a, b in intervals:
        if b - a > 2.000001:
            match = next((x for x in ledger.get('exceptions', [])
                          if x.get('start') == a and x.get('end') == b
                          and str(x.get('reason', '')).strip()), None)
            if match is None:
                raise ValueError(f'Unexplained motion hold {a:g}–{b:g}s exceeds 2s')
            used.append(match)
    return {'status': 'DECLARED_TIMING_PASS', 'scene_fps': 12,
            'operations': len(events), 'exceptions': used,
            'limits': 'Operation truth, artistic quality, captions and listening require separate encoded review'}
