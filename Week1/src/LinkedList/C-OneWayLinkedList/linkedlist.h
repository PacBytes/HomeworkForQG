#ifndef LINKEDLIST_H
#define LINKEDLIST_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>


typedef struct Node {
    void* data;          
    struct Node* next;   
} Node;


typedef struct {
    size_t size;          
    Node* head;
    size_t elementSize;   
} LinkedList;



typedef int(*EQUAL)(void*, void*, size_t);
typedef void(*PRINTNODE)(void*, void*);  
typedef void(*FREEDATA)(void*);          

// 接口
LinkedList* getLoopIntegerList(int num, int entranceIndex);
int hasLoop(LinkedList* list); // 作业：成环判断
int getMidIndexByCalculate(LinkedList* list); // 作业：中点获取
void change(LinkedList* list); // 作业：奇偶互换

void* getDataByIndex(LinkedList* list, size_t index);  
void insertLinkedList(LinkedList* list, void* data); 
Node* createNode(void* data, size_t elementSize);  
LinkedList* createList(size_t elementSize);        
void deleteNodeData(LinkedList* list, void* data, EQUAL eq);  
Node* findNodeByData(LinkedList* list, void* data, EQUAL eq);  
void* findDataByData(LinkedList* list, void* data, EQUAL eq);   
size_t traverse(LinkedList* list, PRINTNODE print, void* other);  
void reverseLinkedList(LinkedList* list);

void printInt(void* data, void* other);  
int deleteNodeByIndex(LinkedList* list, int pos);  
void freeList(LinkedList* list, FREEDATA freeDataFunc);  

#endif 
