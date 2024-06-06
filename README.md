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

- Projects that have been abandoned due to tech debt (if I can find any) will have a very high entropy
- Codebases should have their entropy decrease following (large?) refactors
- Codebase entropy should increase as more functionality is added
- Codebase entropy per loc (is loc a good measure here?) should be lower when written by more experienced engineers
- Codebases with high entropy should have a greater tendency to increase that entropy with new additions
- Codebases with high entropy should be more difficult to contribute to, with those contributions taking longer
- Codebases with high entropy should have more bugs

Does all of this tie into SATD?
https://arxiv.org/abs/2311.12019#:~:text=Developers%20frequently%20acknowledge%20these%20sub,admitted%20technical%20debt%20(SATD).
https://xin-xia.github.io/publication/emse172.pdf

Expectations for entropy calculation

- entropy of procedural script with no function declarations (Sp) should meet: Sp ∝ ln(loc)
- script with reused functions with same loc (Sf) should meet: Sf < Sp

Entropy should be the average of the entropies of each node. How many rearrangements of the children are possible?

r.e. factorials
Factorials of large numbers could become computationally expensive
Approximations exist
Stirlings approximation seems good for large numbers
https://arpita95b.medium.com/stirlings-approximation-a-powerful-tool-to-approximate-factorials-bcad5089e658

How does this relate to cyclomatic complexity?
other reading:
https://dependencies.app/entropy
