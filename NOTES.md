a new project

testing a hypothesis.
Hypothesis was formulated when considering things like connascence & software craftsmanship

Hypothesis: Maintainability of a codebase can be correlated to an entropy value, that can be computed from the abstract syntax tree.

Questions:
How the hell do you analyse the typescript AST?
Which bits of the AST should be included in amy entropy calculation?
How the hell do you calculate or infer maintainability?
Is the ts-compiler the correct tool to analyse these files? seems to be doing not-the-right-stuff*tm*

next step: figure out how to get an AST that represents all the different tokens in a file, rather than just the smart "this is what we're going to be executing" stuff

tests that could confirm or deny

-   Projects that have been abandoned due to tech debt (if I can find any) will have a very high entropy
-   Codebases should have their entropy decrease following (large?) refactors
-   Codebase entropy should increase as more functionality is added
-   Codebase entropy per loc (is loc a good measure here?) should be lower when written by more experienced engineers
-   Codebases with high entropy should have a greater tendency to increase that entropy with new additions
-   Codebases with high entropy should be more difficult to contribute to, with those contributions taking longer
-   Codebases with high entropy should have more bugs

Does all of this tie into SATD?
https://arxiv.org/abs/2311.12019#:~:text=Developers%20frequently%20acknowledge%20these%20sub,admitted%20technical%20debt%20(SATD).
https://xin-xia.github.io/publication/emse172.pdf

Expectations for entropy calculation

-   entropy of procedural script with no function declarations (Sp) should meet: Sp ∝ ln(loc)
-   script with reused functions with same loc (Sf) should meet: Sf < Sp

Entropy should be the average of the entropies of each node. How many rearrangements of the children are possible?

r.e. factorials
Factorials of large numbers could become computationally expensive
Approximations exist
Stirlings approximation seems good for large numbers
https://arpita95b.medium.com/stirlings-approximation-a-powerful-tool-to-approximate-factorials-bcad5089e658

How does this relate to cyclomatic complexity?
other reading:
https://dependencies.app/entropy

next step could be to construct a tree out of the directory structure so that the system can compute the tree entropy very similarly to how the files do

how can we factor in the number of times a particular module is referenced?

Can you construct a tree out of module references? probably more of a graph?

Maybe I could take inspiration from the dependencies entropy pictured above

entropy per loc represents a sort of... complexity density.
You would expect this to increase as a project matures, adding more edge cases and error handling.

worth outputting the entropy hot spots?


S = k*ln(_omega)
S = entropy
k = boltzman constant
ln = natural log
_omega = number of configurations of the system

a b c d e
a d e b c
5 items
5!
_omega = 120

a b | c d e
2 items & 3 items
2! + 3! + 2!

b a | e d c
d c e | b a

2! = 2
3! = 6

120 -> 14

ln(120) > ln(14)

