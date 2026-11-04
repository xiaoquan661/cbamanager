import os, glob, shutil
from PIL import Image

root = r"C:\10.19源码\签下整个CBA"
backup = os.path.join(root, "recon", "backup-assets-20261103")
os.makedirs(backup, exist_ok=True)

def targets():
    for p in glob.glob(os.path.join(root, "assets", "home-fast", "*")):
        if p.lower().endswith((".webp", ".jpg", ".jpeg")):
            yield p, 1200
    for p in glob.glob(os.path.join(root, "assets", "lobby", "*")):
        if p.lower().endswith((".webp", ".jpg", ".jpeg")):
            yield p, 1000

total_before = total_after = 0
for path, maxw in targets():
    before = os.path.getsize(path)
    total_before += before
    im = Image.open(path)
    w, h = im.size
    if w > maxw:
        im = im.resize((maxw, round(h * maxw / w)), Image.LANCZOS)
    ext = os.path.splitext(path)[1].lower()
    shutil.copy2(path, os.path.join(backup, os.path.basename(path)))
    if ext == ".webp":
        im.save(path, "WEBP", quality=72, method=6)
    else:
        im.convert("RGB").save(path, "JPEG", quality=78, optimize=True, progressive=True)
    after = os.path.getsize(path)
    total_after += after
    print(f"{os.path.basename(path):28s} {w}x{h} -> {im.size[0]}x{im.size[1]}  {before/1024:7.1f}KB -> {after/1024:7.1f}KB")
print(f"TOTAL {total_before/1024/1024:.2f}MB -> {total_after/1024/1024:.2f}MB")