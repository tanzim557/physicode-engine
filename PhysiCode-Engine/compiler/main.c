#include <stdio.h>
#include <stdlib.h>

extern FILE *yyin;

int yyparse();

void generateJSON();

FILE *jsonFile;


int main(int argc, char *argv[])
{

    if (argc > 1)
    {
        yyin = fopen(argv[1], "r");

        if (yyin == NULL)
        {
            printf("Cannot open input file!\n");
            return 1;
        }
    }
    else
    {
        printf("No input file provided!\n");
        return 1;
    }


    printf("===== PhysiCode Engine =====\n\n");


    /* Create output JSON file */

    jsonFile = fopen("output.json","w");


    if(jsonFile == NULL)
    {
        printf("Cannot create output.json\n");
        return 1;
    }


    /* Run Parser */

    yyparse();


    /* Generate JSON */

    generateJSON();


    fclose(jsonFile);
    fclose(yyin);


    printf("\nJSON Generated Successfully!\n");


    return 0;
}