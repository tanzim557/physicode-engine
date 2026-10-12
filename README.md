# ðŸŒŒ PhysiCode Engine - Physics Simulation DSL & Compiler

[![C Language](https://img.shields.io/badge/C-A8B9CC?style=for-the-badge&logo=c&logoColor=black)](https://en.wikipedia.org/wiki/C_(programming_language))
[![Compiler](https://img.shields.io/badge/Compiler-Flex_%26_Bison-blue?style=for-the-badge)](https://en.wikipedia.org/wiki/Compiler)
[![Physics Engine](https://img.shields.io/badge/Physics_Engine-Simulation-orange?style=for-the-badge)](https://en.wikipedia.org/wiki/Physics_engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> A custom domain-specific programming language (DSL) and execution compiler for scientific physics simulations. Translates declarative physics code into structured computational instruction matrices (output.json) and real-time frontend visualization.

---

## ðŸŒŸ Key Architecture

- **ðŸ”¡ Lexical Analysis (compiler/lexer.l)**: Custom token definitions for physics primitives (ody, mass, elocity, gravity, collision, 	ime_step).
- **ðŸ“ Syntax Parser (compiler/parser.y)**: LALR parser constructing concrete syntax trees and validating physical constraints.
- **âš™ï¸ Simulation Engine Core (compiler/simulation.c)**: Integrates numerical equations of motion, Euler integration, and kinematic collision resolution.
- **ðŸ“„ Complete Formal Specification**:
  - [docs/grammar.md](PhysiCode-Engine/docs/grammar.md): Formal EBNF grammar specification.
  - [docs/syntax.md](PhysiCode-Engine/docs/syntax.md): Language syntax guidelines.
  - [docs/architecture.md](PhysiCode-Engine/docs/architecture.md): Deep-dive system design.

---

## ðŸš€ Building the Compiler

`ash
cd PhysiCode-Engine/compiler

# Build using GNU Make
make

# Execute a simulation script
./physicode.exe < ../examples/planetary_orbit.phys
`

---

## ðŸ‘¤ Author

Developed by **[Mubassher Alam Tanzim](https://github.com/tanzim557)**  
GitHub: [@tanzim557](https://github.com/tanzim557) â€¢ Email: mubassheralam0@gmail.com

---

## ðŸ“„ License
This project is licensed under the MIT License.
