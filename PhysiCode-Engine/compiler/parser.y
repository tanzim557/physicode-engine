%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void yyerror(const char *s);
int yylex();

extern FILE *jsonFile;

#define MAX_ENVIRONMENTS 10

typedef struct
{
    char type[50];
    float gravity;

} Environment;

Environment environments[MAX_ENVIRONMENTS];

int environmentCount = 0;
int activeEnvironment = 0;

#define MAX_OBJECTS 100

typedef struct
{
    char name[50];
    char shape[50];

    float radius;
    float width;
    float height;
    float mass;

    float posX;
    float posY;

    float velX;
    float velY;

    char color[50];

    float elasticity;

} PhysicsObject;

PhysicsObject objects[MAX_OBJECTS];

int objectCount = 0;

int trailEnabled;
float slowMotionValue;
%}


/* -------------------------
   Semantic Value
-------------------------- */

%union
{
    char *sval;
    float fval;

    struct
    {
        float x;
        float y;
    } vector;
}

/* -------------------------
   Tokens
-------------------------- */

%token ENVIRONMENT
%token SETTINGS
%token OBJECT
%token ACTIVEENVIRONMENT

%token TYPE
%token GRAVITY

%token SHAPE
%token RADIUS
%token WIDTH
%token HEIGHT
%token MASS
%token POSITION
%token VELOCITY
%token COLOR
%token ELASTICITY

%token TRAIL
%token SLOWMOTION

%token TRUE
%token FALSE

%token <sval> IDENTIFIER
%token <fval> NUMBER

%type <vector> vector
%%

program
    : statement_list
    ;

statement_list
    : statement
    | statement_list statement
    ;

statement
    : environment
    | active_environment
    | settings
    | object
    ;

environment
    : ENVIRONMENT '{'
      environment_body
      '}'
    ;

    environment_body
    : type_statement
    ;


    type_statement
        : TYPE '=' IDENTIFIER ';'
    {
        strcpy(environments[environmentCount].type, $3);

        if(strcmp($3,"Earth")==0)
        environments[environmentCount].gravity = 9.8;

        else if(strcmp($3,"Moon")==0)
        environments[environmentCount].gravity = 1.62;

        else if(strcmp($3,"Mars")==0)
        environments[environmentCount].gravity = 3.71;

        else if(strcmp($3,"Space")==0)
        environments[environmentCount].gravity = 0.0;

        else
        {
            printf("Unknown Environment : %s\n",$3);
            environments[environmentCount].gravity = 9.8;
        }

        printf("Environment : %s\n",
        environments[environmentCount].type);

        printf("Gravity : %.2f\n",
        environments[environmentCount].gravity);

        
        environmentCount++;
    }
    ;
    

    active_environment
    : ACTIVEENVIRONMENT '=' IDENTIFIER ';'
    {
        int found = 0;

        for(int i = 0; i < environmentCount; i++)
        {
            if(strcmp(environments[i].type, $3) == 0)
            {
                activeEnvironment = i;
                found = 1;

                printf("Active Environment : %s\n", $3);

                break;
            }
        }

        if(!found)
        {
            printf("Environment %s not found!\n", $3);
        }
    }
    ;

    settings
    : SETTINGS '{'
      settings_body
      '}'
      {
          printf("\nSettings Parsed Successfully!\n");
      }
    ;

    settings_body
    : trail_statement slowmotion_statement
    ;

object
    : OBJECT IDENTIFIER
      {
          strcpy(objects[objectCount].name, $2);
      }
      '{'
      object_body
      '}'
      {
          printf("\nObject Parsed Successfully : %s\n", $2);

          objectCount++;
      }
    ;

object_body
    : shape_statement
      size_statement
      mass_statement
      position_statement
      velocity_statement
      color_statement
      elasticity_statement
    ;

    shape_statement
    : SHAPE '=' IDENTIFIER ';'
      {
          strcpy(objects[objectCount].shape, $3);

          printf("Shape : %s\n",$3);
      }
    ;

   radius_statement
    : RADIUS '=' NUMBER ';'
      {
          objects[objectCount].radius = $3;

          printf("Radius : %.2f\n", $3);
      }
    ;


width_statement
    : WIDTH '=' NUMBER ';'
      {
          objects[objectCount].width = $3;

          printf("Width : %.2f\n", $3);
      }
    ;

height_statement
    : HEIGHT '=' NUMBER ';'
      {
          objects[objectCount].height = $3;

          printf("Height : %.2f\n", $3);
      }
    ;



size_statement
    : radius_statement
    | width_statement height_statement
    ;

mass_statement
    : MASS '=' NUMBER ';'
      {
          objects[objectCount].mass = $3;

          printf("Mass : %.2f\n",$3);
      }
    ;



    vector
    : '(' NUMBER ',' NUMBER ')'
      {
          $$.x = $2;
          $$.y = $4;
      }
    ;

position_statement
    : POSITION '=' vector ';'
      {
          objects[objectCount].posX = $3.x;
          objects[objectCount].posY = $3.y;

          printf("Position : (%.2f , %.2f)\n",
          $3.x,$3.y);
      }
    ;

    velocity_statement
    : VELOCITY '=' vector ';'
      {
          objects[objectCount].velX = $3.x;
          objects[objectCount].velY = $3.y;

          printf("Velocity : (%.2f , %.2f)\n",
          $3.x,$3.y);
      }
    ;

    color_statement
    : COLOR '=' IDENTIFIER ';'
      {
          strcpy(objects[objectCount].color, $3);

          printf("Color : %s\n",$3);
      }
    ;

    elasticity_statement
    : ELASTICITY '=' NUMBER ';'
      {
          objects[objectCount].elasticity = $3;

          

          printf("Elasticity : %.2f\n",$3);
      }
    ;


trail_statement
    : TRAIL '=' TRUE ';'
      {
          trailEnabled = 1;

          printf("Trail : Enabled\n");
      }
    ;


slowmotion_statement
    : SLOWMOTION '=' NUMBER ';'
      {
          slowMotionValue = $3;

          printf("Slow Motion : %.2fx\n",$3);
      }
    ;

     

%%


void generateJSON()
{
    printf("Generating JSON for %d objects\n", objectCount);
    
        fprintf(jsonFile, "{\n");

        fprintf(jsonFile, "  \"environments\": [\n");

        for(int i=0;i<environmentCount;i++)
        {
            fprintf(jsonFile,"    {\n");
            fprintf(jsonFile,"      \"type\":\"%s\",\n",
                    environments[i].type);

            fprintf(jsonFile,"      \"gravity\":%.2f\n",
                    environments[i].gravity);

        fprintf(jsonFile,"    }");

        if(i<environmentCount-1)
            fprintf(jsonFile,",\n");
        else
                fprintf(jsonFile,"\n");
        }

        fprintf(jsonFile,"  ],\n\n");

        fprintf(jsonFile,
        "  \"activeEnvironment\": %d,\n\n",
        activeEnvironment);

        fprintf(jsonFile,"  \"settings\": {\n");
        fprintf(jsonFile,"    \"trail\": %s,\n",
                trailEnabled ? "true" : "false");

        fprintf(jsonFile,"    \"slow_motion\": %.2f\n",
                slowMotionValue);

        fprintf(jsonFile,"  },\n\n");

    // Objects Array শুরু
    fprintf(jsonFile, "  \"objects\": [\n");
    
    // যতোগুলো অবজেক্ট আছে, লুপ চালিয়ে সবগুলোর ডেটা প্রিন্ট করা
    for (int i = 0; i < objectCount; i++) {
        fprintf(jsonFile, "    {\n");
        fprintf(jsonFile, "      \"name\": \"%s\",\n", objects[i].name);
        
       fprintf(jsonFile, "      \"shape\": \"%s\",\n", objects[i].shape);

if(strcmp(objects[i].shape, "circle") == 0)
{
    fprintf(jsonFile,
        "      \"radius\": %.2f,\n",
        objects[i].radius);
}
else if(strcmp(objects[i].shape, "rectangle") == 0)
{
    fprintf(jsonFile,
        "      \"width\": %.2f,\n",
        objects[i].width);

    fprintf(jsonFile,
        "      \"height\": %.2f,\n",
        objects[i].height);
}

    fprintf(jsonFile,
    "      \"mass\": %.2f,\n",
    objects[i].mass);
        fprintf(jsonFile, "      \"position\": { \"x\": %.2f, \"y\": %.2f },\n", objects[i].posX, objects[i].posY);
        fprintf(jsonFile, "      \"velocity\": { \"x\": %.2f, \"y\": %.2f },\n", objects[i].velX, objects[i].velY);
        fprintf(jsonFile, "      \"color\": \"%s\",\n", objects[i].color);
        fprintf(jsonFile, "      \"elasticity\": %.2f\n", objects[i].elasticity);
        fprintf(jsonFile, "    }");
        
        // যদি আরও অবজেক্ট থাকে, তবে কমা (,) দিব, না হলে দিব না
        if (i < objectCount - 1) {
            fprintf(jsonFile, ",\n");
        } else {
            fprintf(jsonFile, "\n");
        }
    }

    // Objects Array এবং JSON ক্লোজ করা
    fprintf(jsonFile, "  ]\n");
    fprintf(jsonFile, "}\n");
}


void yyerror(const char *s)
{
    printf("\nSyntax Error: %s\n", s);
}