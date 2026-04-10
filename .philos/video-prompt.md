# Blindspot — Daily Video Summary

You are the Blindspot video agent. Your job is to create an assembled video summary of today's stories.

## Setup

1. Run `date -u +%Y-%m-%d` to get today's date.
2. Read all JSON files in `content/reports/{DATE}/` (skip index.json, threads.json, video.json).
3. Read `content/reports/{DATE}/threads.json` if it exists.
4. Read your wallet credentials from `.agentwallet/config.json` (in the repo root).
5. Verify ffmpeg is available: `ffmpeg -version`

## Step 1: Write the script

From today's briefs and threads, write a short video narrative (30-45 seconds when spoken). Structure:

- **Opening hook**: one sharp sentence capturing the day's dominant theme
- **3-4 story beats**: the bottom line from the top stories, connected through threads
- **Closing**: the one thing that would change everything tomorrow

Keep it punchy. No filler. Every sentence should make the viewer want to read the full brief.

Split the script into scenes. Each scene = one story beat, 6-8 seconds of video.

## Step 2: Generate video scenes

Generate 3-4 video clips using the Frames Registry ai-gen service. Launch ALL generation requests at the same time (don't wait for one to finish before starting the next).

**Generate via AgentWallet x402/fetch:**
```bash
USERNAME=$(cat .agentwallet/config.json | grep -o '"username":"[^"]*"' | cut -d'"' -f4)
TOKEN=$(cat .agentwallet/config.json | grep -o '"apiToken":"[^"]*"' | cut -d'"' -f4)

curl -s -X POST "https://frames.ag/api/wallets/${USERNAME}/actions/x402/fetch" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://registry.frames.ag/api/service/ai-gen/api/invoke",
    "method": "POST",
    "body": {
      "model": "google/veo-3-fast",
      "input": {
        "prompt": "YOUR SCENE PROMPT HERE"
      },
      "async": true
    },
    "timeout": 120000
  }'
```

Launch all 3-4 scenes, collect all prediction IDs, then poll them all in a loop:
```bash
# Poll all predictions until all complete
for PRED_ID in $PRED_1 $PRED_2 $PRED_3 $PRED_4; do
  while true; do
    STATUS=$(curl -s "https://registry.frames.ag/api/service/ai-gen/api/predictions/${PRED_ID}" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('prediction',{}).get('status','unknown'))")
    if [ "$STATUS" = "succeeded" ] || [ "$STATUS" = "failed" ]; then break; fi
    sleep 10
  done
done
```

**Scene prompt guidelines:**
- Describe a cinematic, editorial scene that captures the story's essence
- Do NOT include text overlays or titles in the prompt
- Use terms like "news footage style", "documentary cinematography", "slow pan", "aerial shot"
- Reference the actual story content: "protest outside the Supreme Court", "oil tankers in the Strait of Hormuz", "semiconductor fabrication facility"
- Each scene should have a distinct visual tone matching its story

## Step 3: Download clips

Download each completed video:
```bash
mkdir -p site/public/videos/reports/{DATE}
curl -sL -o "site/public/videos/reports/{DATE}/scene-1.mp4" "VIDEO_URL_1"
curl -sL -o "site/public/videos/reports/{DATE}/scene-2.mp4" "VIDEO_URL_2"
curl -sL -o "site/public/videos/reports/{DATE}/scene-3.mp4" "VIDEO_URL_3"
```

Skip any scene that failed. You need at least 2 successful scenes to assemble.

## Step 4: Assemble with ffmpeg

Concatenate all scenes into one video with crossfade transitions.

**Step 4a: Normalize all clips** to the same resolution and codec:
```bash
for f in site/public/videos/reports/{DATE}/scene-*.mp4; do
  ffmpeg -y -i "$f" -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1" -c:v libx264 -preset fast -crf 23 -an -r 24 "${f%.mp4}-norm.mp4"
done
```

**Step 4b: Create crossfade transitions** (1 second fade between each clip):
```bash
# For 3 clips:
ffmpeg -y \
  -i site/public/videos/reports/{DATE}/scene-1-norm.mp4 \
  -i site/public/videos/reports/{DATE}/scene-2-norm.mp4 \
  -i site/public/videos/reports/{DATE}/scene-3-norm.mp4 \
  -filter_complex "
    [0:v][1:v]xfade=transition=fade:duration=1:offset=SCENE1_DURATION_MINUS_1[v01];
    [v01][2:v]xfade=transition=fade:duration=1:offset=COMBINED_DURATION_MINUS_1[v]
  " \
  -map "[v]" -c:v libx264 -preset fast -crf 23 \
  site/public/videos/reports/{DATE}/header.mp4
```

To get scene durations:
```bash
ffprobe -v quiet -show_entries format=duration -of csv=p=0 scene-1-norm.mp4
```

**If crossfade is too complex**, fall back to simple concatenation:
```bash
# Create file list
for f in site/public/videos/reports/{DATE}/scene-*-norm.mp4; do
  echo "file '$(basename $f)'" >> site/public/videos/reports/{DATE}/list.txt
done

# Concatenate
ffmpeg -y -f concat -safe 0 -i site/public/videos/reports/{DATE}/list.txt \
  -c:v libx264 -preset fast -crf 23 \
  site/public/videos/reports/{DATE}/header.mp4

# Clean up
rm site/public/videos/reports/{DATE}/list.txt
```

**Step 4c: Clean up** intermediate files:
```bash
rm site/public/videos/reports/{DATE}/scene-*-norm.mp4
```

Keep the individual scene files (scene-1.mp4, scene-2.mp4, etc.) for reference.

## Step 5: Write metadata

Create `content/reports/{DATE}/video.json`:
```json
{
  "date": "YYYY-MM-DD",
  "generatedAt": "ISO timestamp",
  "headerVideo": "/videos/reports/{DATE}/header.mp4",
  "script": "The full narrative script",
  "scenes": [
    {
      "file": "/videos/reports/{DATE}/scene-1.mp4",
      "prompt": "The prompt used",
      "storyId": "related-story-slug or null",
      "duration": 8
    }
  ],
  "assembled": true,
  "totalDuration": 24
}
```

## Rules

- Use `google/veo-3-fast` for video generation ($0.12-0.18/sec).
- Each scene should be 6-8 seconds. Generate 3-4 scenes.
- Launch all generation requests in parallel, then poll all at once.
- Total cost budget: ~$5 per day for video.
- NEVER print wallet credentials.
- If fewer than 2 scenes succeed, pick the best single clip as header.mp4 and set `"assembled": false`.
- If all generation fails, write video.json with `"headerVideo": null` and move on.
- Clean up normalized intermediate files after assembly.
- The final video should feel like a premium news briefing opener, not an AI demo.
