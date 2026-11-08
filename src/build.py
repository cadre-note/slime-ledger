# 用法：cd src && npm install && python3 build.py   → 產生 ../index.html
import subprocess, os
d = os.path.dirname(os.path.abspath(__file__)) + '/'
subprocess.run('npx tailwindcss -c tailwind.config.js -i in.css -o out.css --minify', shell=True, cwd=d, check=True)
css = open(d + 'out.css').read()
subprocess.run('npx esbuild main.jsx --bundle --minify --format=iife --jsx=automatic --define:__PREVIEW__=false --define:process.env.NODE_ENV=\'"production"\' --outfile=out.js', shell=True, cwd=d, check=True)
js = open(d + 'out.js').read().replace('</script', '<\\/script')
h = open(d + 'template.html').read()
h = h.replace('<style></style>', '<style>' + css + '</style>', 1).replace('<script></script>', '<script>' + js + '</script>', 1)
open(d + '../index.html', 'w').write(h)
print('index.html', len(h))
