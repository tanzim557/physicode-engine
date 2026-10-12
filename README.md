# PhysiCode Engine - Physics Simulation DSL and Compiler

[![C Language](https://img.shields.io/badge/C-A8B9CC?style=for-the-badge&logo=c&logoColor=black)](https://en.wikipedia.org/wiki/C_(programming_language))
[![Compiler](https://img.shields.io/badge/Compiler-Flex_and_Bison-blue?style=for-the-badge)](https://en.wikipedia.org/wiki/Compiler)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A custom domain-specific programming language (DSL) and execution compiler for scientific physics simulations. Translates declarative physics code into structured computational instruction matrices and real-time visualization.

---

## Key Architecture

- Lexical Analysis (compiler/lexer.l): Custom token definitions for physics primitives including body, mass, velocity, gravity, and collision.
- Syntax Parser (compiler/parser.y): LALR parser constructing concrete syntax trees and validating physical constraints.
- Simulation Engine Core (compiler/simulation.c): Integrates numerical equations of motion, Euler integration, and kinematic collision resolution.
- Formal Documentation: Comprehensive grammar, syntax, and architecture specifications inside the docs folder.

---

## Building the Compiler

```bash
cd PhysiCode-Engine/compiler

# Build using GNU Make
make

# Execute a simulation script
./physicode.exe < ../examples/planetary_orbit.phys
```

---

## Author

Developed by Mubassher Alam Tanzim
- GitHub: https://github.com/tanzim557
- Email: mubassheralam0@gmail.com

---

## License
This project is licensed under the MIT License.
