#### 333
# scrambles: 546
# Max moves:  21
# Average moves:  18.58058608058608

#### 222
# scrambles: 546
# Max moves:  11

#### 444 (333 + shuffle(222, 333), only RUF wide)
# scrambles: 546
# Max moves:  48
# Average moves:  44.14102564102564
# Simple moves:  33.86813186813187
# Double moves:  10.272893772893774

#### 555
# scrambles: 546
# Max moves:  60
# Simple moves:  29.847985347985347
# Double moves:  30.152014652014653

#### 777
# scrambles: 390
# Max moves:  100
# Simple moves:  33.50512820512821
# Double moves:  33.187179487179485
# Triple moves:  33.30769230769231

#### 666 (only RUF superWide)
# scrambles: 390
# Max moves:  80
# Simple moves:  32.07948717948718
# Double moves:  31.897435897435898
# Triple moves:  16.023076923076925

#### 333bf (333 + only RUF wide)
# scrambles: 390
# Max moves:  23
# Average moves:  20.41025641025641
# Simple moves:  18.835897435897436
# Double moves:  1.5743589743589743
# Scrambles with no wide move:  0.034134615384615387 ((1 / 6) * (1 / 4)?)
# Scrambles with one wide move:  0.343910256410256395 ((1 / 6) * (3 / 4) + (5 / 6) * (1 / 4)?)
# Scrambles with two wide move:  0.62195512820512822 ((5 / 6) * (3 / 4)?)

#### 333fm (R' U' F + 333 + R' U' F)
# scrambles: 78
# Max moves:  26
# Average moves:  24.846153846153847

#### 333oh
# scrambles: 546
# Max moves:  21
# Average moves:  18.71245421245421

#### clock
# scrambles: 546
# Max moves:  15

#### minx (starts with R)
# scrambles: 546
# Max moves:  77

#### pyram (each corner cw ccw none 1/3 1/3 1/3)
# scrambles: 546
# Max moves:  15
# Average moves:  13.655677655677655
# Scrambles with no tips:  0.0018315018315018315
# Scrambles with one tip:  0.11172161172161173
# Scrambles with two tips:  0.3021978021978022
# Scrambles with three tips:  0.3974358974358974
# Scrambles with four tips:  0.18681318681318682

#### skewb
# scrambles: 546
# Max moves:  11

#### sq1
# scrambles: 546
# Max moves:  15
# Average moves:  12.642857142857142
# Scrambles with final slash:  0.3534798534798535

#### 444bf (444 + xyz)
# scrambles: 390
# Max moves:  49
# Average moves:  45.797435897435896
# Simple moves:  35.4974358974359
# Double moves:  10.3
# Scrambles with no wide move:  0.041025641025641026 ((1 / 6) * (1 / 4)?)
# Scrambles with one wide move:  0.358974358974359 ((1 / 6) * (3 / 4) + (5 / 6) * (1 / 4)?)
# Scrambles with two wide move:  0.6 ((5 / 6) * (3 / 4)?)

#### 555bf (555 + superWide RUF)
# Max moves:  62
# Average moves:  61.44615384615385
# Simple moves:  30.294871794871796
# Double moves:  29.587179487179487
# Triple moves:  1.564102564102564
# Scrambles with no wide move:  0.07179487179487179 ((1 / 6) * (1 / 3)?))
# Scrambles with one wide move:  0.41025641025641024 ((5 / 6) * (1 / 3) + (1 / 6) * (2 / 3)?))
# Scrambles with two wide moves:  0.517948717948718 ((5 / 3) * (1 / 3)?))

#### 333mbf (333 + only RUF wide)
# scrambles: 1365
# Max moves:  23
# Average moves:  20.423443223443222
# Simple moves:  18.83809523809524
# Double moves:  1.5853479853479853
# Scrambles with no wide move:  0.0380952380952381 ((1 / 6) * (1 / 4)?)
# Scrambles with one wide move:  0.3384615384615385 ((1 / 6) * (3 / 4) + (5 / 6) * (1 / 4)?)
# Scrambles with two wide moves:  0.6234432234432234 ((5 / 6) * (3 / 4)?)

import os
import json


SOURCE = "source.json"


if __name__ == "__main__":
    file_path = os.path.join(os.path.dirname(__file__), SOURCE)
    try:
        with open(file_path, "r") as file:
            data = json.load(file)
            events = data["wcif"]["events"]
            for event in events:
                id = event["id"]
                scrambles = []
                for round in event["rounds"]:
                    for scramble_set in round["scrambleSets"]:
                        if id != "333mbf":
                            scrambles.extend(scramble_set["scrambles"])
                            scrambles.extend(scramble_set["extraScrambles"])
                        else:
                            for scramble in scramble_set["scrambles"]:
                                scrambles.extend(scramble.splitlines())
                            for scramble in scramble_set["extraScrambles"]:
                                scrambles.extend(scramble.splitlines())
                print("###" + id)
                print("scrambles:", len(scrambles))
                totalMoves = 0
                maxMoves = 0
                totalSimpleMoves = 0
                totalDoubleMoves = 0
                totalTripleMoves = 0
                if id in ["333bf", "444bf", "555bf", "333mbf"]:
                    scramblesWithNoWideMove = 0
                    scramblesWithOneWideMove = 0
                    scramblesWithTwoWideMove = 0
                if id == "pyram":
                    scramblesWithNoTips = 0
                    scramblesWithOneTip = 0
                    scramblesWithTwoTips = 0
                    scramblesWithThreeTips = 0
                    scramblesWithFourTips = 0
                if id == "sq1":
                    scramblesWithFinalSlash = 0
                for scramble in scrambles:
                    if id == "sq1":
                        totalMovesInstance = len(scramble.split("/"))
                    else:
                        totalMovesInstance = len(scramble.split())
                    if id not in ["clock", "sq1"]:
                        totalTripleMovesInstance = scramble.count("3")
                    totalDoubleMovesInstance = (
                        scramble.count("w") - totalTripleMovesInstance
                    )
                    totalSimpleMovesInstance = totalMovesInstance - (
                        totalTripleMovesInstance + totalDoubleMovesInstance
                    )
                    if totalMovesInstance > maxMoves:
                        maxMoves = totalMovesInstance
                    totalMoves += totalMovesInstance
                    totalSimpleMoves += totalSimpleMovesInstance
                    totalDoubleMoves += totalDoubleMovesInstance
                    totalTripleMoves += totalTripleMovesInstance
                    if id in ["333bf", "333mbf"]:
                        if scramble.count("w") == 0:
                            scramblesWithNoWideMove += 1
                        elif scramble.count("w") == 1:
                            scramblesWithOneWideMove += 1
                        elif scramble.count("w") == 2:
                            scramblesWithTwoWideMove += 1
                    if id == "444bf":
                        count = 0
                        if scramble.find("x") != -1:
                            count += 1
                        if scramble.find("y") != -1:
                            count += 1
                        if scramble.find("z") != -1:
                            count += 1
                        if count == 0:
                            scramblesWithNoWideMove += 1
                        elif count == 1:
                            scramblesWithOneWideMove += 1
                        elif count == 2:
                            scramblesWithTwoWideMove += 1
                    if id == "555bf":
                        if totalMovesInstance - 60 == 0:
                            scramblesWithNoWideMove += 1
                        elif totalMovesInstance - 60 == 1:
                            scramblesWithOneWideMove += 1
                        elif totalMovesInstance - 60 == 2:
                            scramblesWithTwoWideMove += 1
                    if id == "pyram":
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
                    if id == "sq1":
                        if scramble.endswith("/"):
                            scramblesWithFinalSlash += 1
                print("Max moves: ", maxMoves)
                if totalMoves / len(scrambles) != maxMoves:
                    print("Average moves: ", totalMoves / len(scrambles))
                if totalDoubleMoves > 0 or totalTripleMoves > 0:
                    print("Simple moves: ", totalSimpleMoves / len(scrambles))

                if totalDoubleMoves > 0:
                    print("Double moves: ", totalDoubleMoves / len(scrambles))
                if totalTripleMoves > 0:
                    print("Triple moves: ", totalTripleMoves / len(scrambles))
                if id in ["333bf", "444bf", "555bf", "333mbf"]:
                    print(
                        "Scrambles with no wide move: ",
                        scramblesWithNoWideMove / len(scrambles),
                    )
                    print(
                        "Scrambles with one wide move: ",
                        scramblesWithOneWideMove / len(scrambles),
                    )
                    print(
                        "Scrambles with two wide moves: ",
                        scramblesWithTwoWideMove / len(scrambles),
                    )
                if id == "pyram":
                    print(
                        "Scrambles with no tips: ", scramblesWithNoTips / len(scrambles)
                    )
                    print(
                        "Scrambles with one tip: ", scramblesWithOneTip / len(scrambles)
                    )
                    print(
                        "Scrambles with two tips: ",
                        scramblesWithTwoTips / len(scrambles),
                    )
                    print(
                        "Scrambles with three tips: ",
                        scramblesWithThreeTips / len(scrambles),
                    )
                    print(
                        "Scrambles with four tips: ",
                        scramblesWithFourTips / len(scrambles),
                    )
                if id == "sq1":
                    print(
                        "Scrambles with final slash: ",
                        scramblesWithFinalSlash / len(scrambles),
                    )
                print()
    except Exception as e:
        print(e)
