import qrcode
data = 'https://toniopap.github.io/quiz_economia_vino/quiz_bilancio_2.html'
img = qrcode.make(data)
img.save('esfinani2.png')