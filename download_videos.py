import os
import subprocess
import sys

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    import yt_dlp
except ImportError:
    install('yt-dlp')
    import yt_dlp

videos = [
    "T1PLEPTbXc4", "QR2MgNYRwSk", "aOXLUZNd1LY", "HOQpg_LYFx8", "HHA3DwXNhjc",
    "NLO9w963Aj0", "inPtRWtvDaM", "viQInAU0ekc", "KE4blc-4jqE", "HCCm0lFwqNw",
    "0S1Wz1xaSLg", "IUW5FZNxQmM", "mxOzK5-QLlk"
]

out_dir = "public/videos"
os.makedirs(out_dir, exist_ok=True)

ydl_opts = {
    'format': 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    'outtmpl': os.path.join(out_dir, '%(id)s.%(ext)s'),
    'quiet': False,
    'no_warnings': True,
    'merge_output_format': 'mp4'
}

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    for vid in videos:
        url = f"https://www.youtube.com/watch?v={vid}"
        print(f"Downloading {vid}...")
        try:
            ydl.download([url])
        except Exception as e:
            print(f"Failed to download {vid}: {e}")
