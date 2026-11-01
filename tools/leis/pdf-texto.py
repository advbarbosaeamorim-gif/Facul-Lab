"""Extrai o texto de um PDF da OAB (Código de Ética, Regulamento Geral) para o gerador de leis.
Uso: python3 tools/leis/pdf-texto.py entrada.pdf saida.txt
Precisa do pdfplumber (pip install pdfplumber). Cada página sai separada por uma linha "\\f"."""
import sys

import pdfplumber

with pdfplumber.open(sys.argv[1]) as pdf:
    paginas = [(p.extract_text() or "") for p in pdf.pages]
with open(sys.argv[2], "w", encoding="utf-8") as f:
    f.write("\n\f\n".join(paginas))
