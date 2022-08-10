from PIL import Image
import os
import string
dir = os.path.dirname(os.path.abspath(__file__))


# finished_files = list(map(lambda x: x[:-4],os.listdir(dir + "\\png\\")))

MAX_SIZE = 500

# if not os.path.isdir(dir+'\\resized\\'):
#     os.mkdir(dir+'\\resized\\')

for letter in string.ascii_lowercase:
    for file in os.listdir(dir +'\\' +letter):
        if file.split('.')[-1] in ['jpg','png']:
            print(f"found {file}")
            im = Image.open(dir+ '\\'+ letter + '\\' + file).convert("RGBA")
            f, e = os.path.splitext(file)
            ratio = im.width/im.height
            name = (f.split('\\')[-1])
            new_width = im.width
            new_height = im.height
            if im.width > MAX_SIZE or im.height>MAX_SIZE:
                if im.width>im.height:
                    new_width = round(MAX_SIZE)
                    new_height = round(MAX_SIZE/ratio)
                else:
                    new_width = round(MAX_SIZE*ratio)
                    new_height = round(MAX_SIZE)
            imResize = im.resize((new_width,new_height), Image.ANTIALIAS)
            imResize.save(dir + '\\'+letter +'\\' + name + '.png', 'PNG', quality=95)
print("finished.")
