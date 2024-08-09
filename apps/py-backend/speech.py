import yt_dlp

ydl_opts = {
    'format': 'best',
    'outtmpl': 'downloaded_videos/%(title)s.%(ext)s',
}
with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    ydl.download(['https://www.youtube.com/watch?v=example_video_id'])
