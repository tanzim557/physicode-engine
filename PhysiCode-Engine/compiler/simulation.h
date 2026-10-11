#ifndef SIMULATION_H
#define SIMULATION_H

#define MAX_OBJECTS 100

typedef struct
{
    char name[50];

    char shape[30];

    float radius;

    float mass;

    float posX;
    float posY;

    float velX;
    float velY;

    char color[30];

    float elasticity;

} PhysicsObject;

typedef struct
{
    char environment[50];

    float gravity;

    int trail;

    float slowMotion;

    PhysicsObject objects[MAX_OBJECTS];

    int objectCount;

} Simulation;

extern Simulation sim;

void initializeSimulation();

void generateJSON();

#endif