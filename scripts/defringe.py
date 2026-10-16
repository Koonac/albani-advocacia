# Remove franja escura do recorte (dr-ivan-corpo-transparente.png):
# Fundo preto + alfa suave → halo escuro sobre o mapa dourado do hero.
# Pipeline: black-matte cleanup → choke forte → alfa quase duro (feather mínimo).
# Saída: assets-src/dr-ivan-corpo-limpo.png (lida por optimize-images.mjs)
import sys
import numpy as np
from PIL import Image, ImageFilter

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGBA')
bbox = im.getbbox()
if bbox:
    im = im.crop(bbox)

arr = np.array(im).astype(np.float32)
rgb, alpha = arr[:, :, :3], arr[:, :, 3]

# Remove black matte nas bordas (recupera cor do sujeito)
a_norm = np.maximum(alpha / 255.0, 1.0 / 255.0)
edge = (alpha > 0) & (alpha < 254)
rgb[edge] = np.clip(rgb[edge] / a_norm[edge, None], 0, 255)

# Propaga cor do interior opaco
known = alpha >= 248
color = rgb.copy()
for _ in range(10):
    pad_c = np.pad(color, ((1, 1), (1, 1), (0, 0)), mode='edge')
    pad_k = np.pad(known.astype(np.float32), ((1, 1), (1, 1)), mode='constant')
    wsum = np.zeros(alpha.shape, dtype=np.float32)
    csum = np.zeros_like(color)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            ys = slice(1 + dy, pad_k.shape[0] - 1 + dy)
            xs = slice(1 + dx, pad_k.shape[1] - 1 + dx)
            wk = pad_k[ys, xs]
            wsum += wk
            csum += pad_c[ys, xs] * wk[..., None]
    fill = (~known) & (alpha > 0) & (wsum > 0)
    if not fill.any():
        break
    color[fill] = csum[fill] / wsum[fill, None]
    known[fill] = True

arr[:, :, :3] = color
arr[:, :, 3] = alpha
out_im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), 'RGBA')

r, g, b, a = out_im.split()
# Choke ~5px (corta a franja) + limiariza (mata halo semi-transparente) + feather 1px
a = a.filter(ImageFilter.MinFilter(11))
a_arr = np.array(a)
# Alfa duro: evita anel semi-transparente escuro sobre o mapa dourado
a_arr = np.where(a_arr >= 160, 255, 0).astype(np.uint8)
a = Image.fromarray(a_arr, mode='L').filter(ImageFilter.GaussianBlur(0.35))
Image.merge('RGBA', (r, g, b, a)).save(out)
