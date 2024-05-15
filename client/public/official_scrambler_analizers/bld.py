# brute forces the probability of zero, one or two wide moves in a scramble
scramblesWithNoWideMoves = 0
scramblesWithOneWideMove = 0
scramblesWithTwoWideMoves = 0
scrambles = input("Enter scrambles: ").split(";")
for scramble in scrambles:
    if scramble.count("w") == 0:
        scramblesWithNoWideMoves += 1
    elif scramble.count("w") == 1:
        scramblesWithOneWideMove += 1
    elif scramble.count("w") == 2:
        scramblesWithTwoWideMoves += 1
    else:
        print("Error: scramble contains more than two wide moves")
print("Scrambles with no wide moves: ", scramblesWithNoWideMoves / len(scrambles))
print("Scrambles with one wide move: ", scramblesWithOneWideMove / len(scrambles))
print("Scrambles with two wide moves: ", scramblesWithTwoWideMoves / len(scrambles))
