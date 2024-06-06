Hypothesis: Maintainability of a codebase can be correlated to an entropy value, that can be computed from the abstract syntax tree. And maintainability to correlatable to the cost of implementation of new features.

- Projects that have been abandoned due to tech debt (if I can find any) will have a very high entropy
- Codebases should have their entropy decrease following (large?) refactors
- Codebase entropy should increase as more functionality is added
- Codebase entropy per loc (is loc a good measure here?) should be lower when written by more experienced engineers
- Codebases with high entropy should have a greater tendency to increase that entropy with new additions
- Codebases with high entropy should be more difficult to contribute to, with those contributions taking longer
- Codebases with high entropy should have more bugs
- entropy should correlate with other computional indicators of code quality such as cyclomatic complexity
