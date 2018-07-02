import sys
import glob, os

def search(query):
    sys.stdout.flush()
    os.chdir("views/docs")
    results = []
    for file in glob.glob("*.pug"):
        # blacklist = ["search.pug", "layout.pug"]
        blacklist = ["docIndex.pug", "results.pug"]
        if file in blacklist:
            continue

        f = open(file)
        cont = f.read()
        f.close()
        cont = cont[cont.find("block content"):cont.rfind(".nav")if ".nav" in cont else len(cont) -1]
        newStr = ""
        for i in cont.split("\n"):
            newStr += join(i.split()[1:]) + "\n"
            # newStr += i

        newStr = newStr.lower()
        if query in newStr:
            results.append(file[:-4])

    if len(results) == 0:
        return "No Results Found"
    return prepForView(results)

def join(arr):
    newStr = ""
    for i in arr:
        newStr += i + " "
    return newStr

def prepForView(str):
    newStr = ""
    for i in str:
        newStr += i + ","
    return newStr[:-1]

print (search(sys.argv[1].lower()))
sys.stdout.flush()
