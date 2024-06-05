a new project

testing a hypothesis.

Hypothesis: Maintainability of a codebase can be correlated to an entropy value, that can be computed from the abstract syntax tree.

Questions:
How the hell do you analyse the typescript AST?
Which bits of the AST should be included in amy entropy calculation?
How the hell do you calculate or infer maintainability?
Is the ts-compiler the correct tool to analyse these files? seems to be doing not-the-right-stuff*tm*

next step: figure out how to get an AST that represents all the different tokens in a file, rather than just the smart "this is what we're going to be executing" stuff
