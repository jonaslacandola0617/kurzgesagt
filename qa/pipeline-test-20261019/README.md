# Pipeline test, 2026-10-19

Not episode content. Proves the experiment's deterministic capture and encode path.

Run (cloud workspace): copy `assets/fonts/Manrope800.ttf` beside `index.html`, then `node cap.mjs <this dir>` (writes `frames/`, prints determinism stats), then:

```
ffmpeg -framerate 30 -i frames/f%05d.png -i mix.wav -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -b:v 12M -maxrate 16M -bufsize 24M -r 30 -c:a aac -b:a 320k -ar 48000 -ac 2 -movflags +faststart -shortest test.mp4
```
`mix.wav` = two sine tones through `loudnorm=I=-13:TP=-1.5`. See `RESULTS.json`.
