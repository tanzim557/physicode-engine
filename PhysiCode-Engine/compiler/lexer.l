%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "parser.tab.h"

extern FILE *yyin;

int line = 1;
%}


DIGIT      [0-9]
LETTER     [a-zA-Z]
ID         {LETTER}({LETTER}|{DIGIT}|_)*
NUMBER     -?{DIGIT}+(\.[0-9]+)?

%%

[ \t\r]+      ;

\n            { line++; }



"Environment"      { return ENVIRONMENT; }

"Settings"         { return SETTINGS; }

"Object"           { return OBJECT; }

"ActiveEnvironment"     { return ACTIVEENVIRONMENT; }

"type"             { return TYPE; }

"gravity"          { return GRAVITY; }

"shape"            { return SHAPE; }

"radius"           { return RADIUS; }

"width"            { return WIDTH; }

"height"           { return HEIGHT; }

"mass"             { return MASS; }

"position"         { return POSITION; }

"velocity"         { return VELOCITY; }

"color"            { return COLOR; }

"elasticity"       { return ELASTICITY; }

"trail"            { return TRAIL; }

"slowmotion"       { return SLOWMOTION; }

"true"             { return TRUE; }

"false"            { return FALSE; }



{NUMBER}      { yylval.fval = atof(yytext); return NUMBER; }



{ID}          { yylval.sval = strdup(yytext); return IDENTIFIER; }



"{"      { return '{'; }

"}"      { return '}'; }

"("      { return '('; }

")"      { return ')'; }

";"      { return ';'; }

","      { return ','; }

"="      { return '='; }

.   { printf("Lexical Error at line %d : %s\n", line, yytext); }

%%

int yywrap()
{
    return 1;
}