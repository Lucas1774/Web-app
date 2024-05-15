# brute forces the probability of zero, one, two, three or four tips scrambled in a scramble
scramblesWithNoTips = 0
scramblesWithOneTip = 0
scramblesWithTwoTips = 0
scramblesWithThreeTips = 0
scramblesWithFourTips = 0
scrambles = input("Enter scrambles: ").split(";")
for scramble in scrambles:
    count = 0
    if scramble.find("u") != -1:
        count += 1
    if scramble.find("b") != -1:
        count += 1
    if scramble.find("r") != -1:
        count += 1
    if scramble.find("l") != -1:
        count += 1
    if count == 0:
        scramblesWithNoTips += 1
    elif count == 1:
        scramblesWithOneTip += 1
    elif count == 2:
        scramblesWithTwoTips += 1
    elif count == 3:
        scramblesWithThreeTips += 1
    elif count == 4:
        scramblesWithFourTips += 1
    else:
        print("Error: scramble contains more than four scrambled tips")
print("Scrambles with no tips scrambled: ", scramblesWithNoTips / len(scrambles))
print("Scrambles with one tip scrambled: ", scramblesWithOneTip / len(scrambles))
print("Scrambles with two tips scrambled: ", scramblesWithTwoTips / len(scrambles))
print("Scrambles with three tips scrambled: ", scramblesWithThreeTips / len(scrambles))
print("Scrambles with four tips scrambled: ", scramblesWithFourTips / len(scrambles))
