""" 
page: https://github.com/lincolnloop/python-qrcode
(Way 1) run from cmd |qr "Some text"|
(Way 2) run source code "python index.py" - code below
 """

import qrcode
import re
from datetime import datetime
data = input('Give me some data 🧀: ')
is_link_in_iPhone = bool(re.search("(\.|:)\S", data))

if is_link_in_iPhone: data = (f"BEGIN:VCARD\r\nFN:URL\r\nADR;TYPE=home:;;{data}\r\nEND:VCARD")

img = qrcode.make(data)
type(img)
time_stamp = datetime.now().strftime("%d-%m_%H-%M-%S")
img.save(f"{time_stamp}.png")

# 
import os
os.system(f"{time_stamp}.png")

# (TODO) create a text-base file to save history [text]:[qr file]
# (TODO) how to paste text back from phone -> pc
# (TODO) include text to image