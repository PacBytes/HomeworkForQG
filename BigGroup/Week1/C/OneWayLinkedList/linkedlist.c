#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include "linkedlist.h"
// version:1.0 tested:yes, everything work well

// test pass
LinkedList* getLoopIntegerList(int num, int entranceIndex) {
    LinkedList* list = createList(sizeof(int));
    if (list != NULL && num > 0 && entranceIndex >= 0 && num > entranceIndex) {
        for (int i = 1; i <= num; ++i) {
            insertLinkedList(list, (void*)&i);
        }

        Node* y = list->head;
        for (int x = 0; x < entranceIndex; ++x) {
            y = y->next;
        }
        
        Node* x = list->head;
        while (x->next != NULL) {
            x = x->next;
        }
        
        x->next = y;
    }

    return list;
}

// test pass
// int main() {
//    for (int i = 0; i < 10; ++i) {
//        LinkedList* list = getLoopIntegerList(10, i);
//        printf("测试参数（长度：10，入口：%d），", i);
//        if (hasLoop(list) != -1) {
//             printf("判断结果：有环，环的入口索引为：%d\n", hasLoop(list));
//        } else {
//             printf("无环");
//        }
//    }
// }
int hasLoop(LinkedList* list) { // 作业：成环判�?
    Node* fast = list->head;
    Node* slow = list->head;

    while (fast != NULL && fast->next != NULL && fast->next->next != NULL && slow != NULL) {
        fast = fast->next->next;
        slow = slow->next;
        if (fast == slow) {
            Node* x = list->head;
            int index = 0;
            while (x != slow) {
                x = x->next;
                slow = slow->next;
                ++index;
            }
            return index;
        }
    }
    return -1;
}

// test pass
// int main(){
//     LinkedList* list = createList(sizeof(int));
//     if (list != NULL) {
//         for (int i = 1; i <= 11; ++i) {
//             insertLinkedList(list, (void*)&i);
//         }
//     }

//     printf("%d", getMidIndexByCalculate(list));
//     freeList(list, NULL);
// }
int getMidIndexByCalculate(LinkedList* list) { // 作业：中点获�?
    int index = 0;
    Node* fast = list->head;
    while (fast != NULL && fast->next != NULL && fast->next->next != NULL) {
        ++index;
        fast = fast->next->next;
    }
    return index;
}

// int main(){
//     for (int j = 1; j <= 10; ++j) {
//         LinkedList* list = createList(sizeof(int));
//         if (list != NULL) {
//             for (int i = 1; i <= j; ++i) {
//                 insertLinkedList(list, (void*)&i);
//             }
//         }

//         change(list);
//         traverse(list, printInt, NULL);
//         printf("\n");
//         freeList(list, NULL);
//     }
// }
// test pass
void change(LinkedList* list) { // 作业：奇偶互�?
    if (list->size >= 2) {
        Node* first = list->head;
        Node* mid = first->next;
        Node* last = mid->next;

        first->next = mid->next;
        mid->next = first;
        list->head = mid;


        if (list->size == 2 || list->size == 3) {
            return;
        }

        mid = first->next;
        last = mid->next;

        while (1) {
            mid->next = last->next;
            last->next = mid;
            first->next = last;

            if (mid->next == NULL) {
                return;
            } else if (mid->next->next == NULL) {
                return;
            }

            first = mid;
            mid = first->next;
            last = mid->next;
        }
    }
}

// int main(){
//     for (int j = 1; j <= 10; ++j) {
//         LinkedList* list = createList(sizeof(int));
//         if (list != NULL) {
//             for (int i = 1; i <= j; ++i) {
//                 insertLinkedList(list, (void*)&i);
//             }
//         }

//         printf("before: ");
//         traverse(list, printInt, NULL);
//         reverseLinkedList(list);
//         printf("\nafter: ");
//         traverse(list, printInt, NULL);
//         printf("\n");
//         freeList(list, NULL);
//     }
// }
// test pass
void reverseLinkedList(LinkedList* list) {
    if (list->size  >= 2) {
        Node* first = list->head;

        Node* tail = list->head;
        while (tail->next != NULL) {
            tail = tail->next;
        }

        Node* mid = first->next;
        Node* last = mid->next;

        first->next = NULL;

        while (last != NULL) {
            mid->next = first;

            first = mid;
            mid = last;
            last = last->next;
        }

        mid->next = first;
        
        list->head = tail;
    }
}

Node* createNode(void* data, size_t elementSize) {
    Node* newNode = (Node* )calloc(1, sizeof(Node));
    if (newNode == NULL) {
        fprintf(stderr, "(createNode): Memory allocation failed for new node.\n");
        return NULL;
    }

    
    newNode->data = malloc(elementSize);
    if (newNode->data == NULL) {
        fprintf(stderr, "(createNode): Memory allocation failed for node data.\n");
        return NULL;
    }

    
    memcpy(newNode->data, data, elementSize);
    newNode->next = NULL;

    return newNode;
}


LinkedList* createList(size_t elementSize) {
    LinkedList* list = (LinkedList* )malloc(sizeof(LinkedList));
    if (list == NULL) {
        fprintf(stderr, "(createList): Memory allocation failed for linked list.\n");
        exit(EXIT_FAILURE);
    }

    
    list->head = NULL;
    list->elementSize = elementSize;
    list->size = 0;
    return list;
}



void insertLinkedList(LinkedList* list, void* data) {
    Node* newNode = createNode(data, list->elementSize);

    
    if (list->head == NULL) {
        list->head = newNode;
    } else {
        
        Node* pcur = list->head;
        while (pcur->next != NULL) {
            pcur = pcur->next;
        }
        pcur->next = newNode;
    }
    
    list->size++;
}


int defaultEq(void* data1, void* data2, size_t elementSize){
    return memcmp(data1, data2, elementSize);
}
void deleteNodeData(LinkedList* list, void* data, EQUAL eq) {
    Node* pcur = list->head;
    Node* prev = NULL;
    if (eq == NULL) eq = defaultEq;
    while (pcur != NULL) {
        
        if (eq(pcur->data, data, list->elementSize) == 0) {
            if (prev == NULL) {
                
                list->head = pcur->next;
            } else {
                
                prev->next = pcur->next;
            }
            
            free(pcur->data);
            free(pcur);
            pcur = NULL;
            
            list->size--;
            return;
        }
        
        prev = pcur;
        pcur = pcur->next;
    }
}


Node* findNodeByData(LinkedList* list, void* data, EQUAL eq) {
    Node* pcur = list->head;
    if (eq == NULL) eq = defaultEq;
    while (pcur != NULL) {
        if (eq(pcur->data, data, list->elementSize) == 0) {
            return pcur;
        }

        pcur = pcur->next;
    }

    return NULL;
}

void* findDataByData(LinkedList* list, void* data, EQUAL eq){
    Node* node = findNodeByData(list, data, eq);
    if(node == NULL) return NULL;
    return node->data;
}


size_t traverse(LinkedList* list, PRINTNODE print, void* other) {
    size_t length = 0;
    Node* pcur = list->head;

    if(list==NULL){
        fprintf(stderr, "NULL");
        exit(EXIT_FAILURE);
    }

    while (pcur != NULL) {
        print(pcur->data, other);
        length += 1;
        pcur = pcur->next;
    }
    return length;
}



void* getDataByIndex(LinkedList* list, size_t index) {
    if (list == NULL) {
        fprintf(stderr, "(getDataByIndex): Error: Linked list is NULL.\n");
        return NULL;
    }

    Node* pcur = list->head;

    for (size_t i = 0; i < index && pcur != NULL; ++i) {
        pcur = pcur->next;
    }

    if (pcur != NULL) {
        return pcur->data;
    } else {
        fprintf(stderr, "(getDataByIndex): Error: Index out of bounds.\n");
        return NULL;
    }
}


void printInt(void* data, void* other) {
    
    printf("%d -> ",*((int*)data));
}

int deleteNodeByIndex(LinkedList* list, int pos) {
    if (list == NULL) {
        fprintf(stderr, "(deleteNodeByIndex): Linked list is NULL.\n");
        return EXIT_FAILURE;
    }

    if (pos < 0 || pos >= list->size) {
        fprintf(stderr, "(deleteNodeByIndex): Error: Index out of bounds.\n");
        return EXIT_FAILURE;
    }

    Node* pcur = list->head;
    Node* prev = NULL;

    
    for (int i = 0; i < pos; ++i) {
        prev = pcur;
        pcur = pcur->next;
    }

    if (prev == NULL) {
        
        list->head = pcur->next;
    } else {
        
        prev->next = pcur->next;
    }

    
    free(pcur->data);
    free(pcur);
    pcur = NULL;

    
    list->size--;

    return EXIT_SUCCESS;
}

#pragma region UNDEBUG


void freeList(LinkedList* list, FREEDATA freeDataFunc) {
    if (list == NULL)
    {
        fprintf(stderr, "(freeList): LinkedList is NULL!! Maybe you have already recycled the memory.\n");
        return;
    }

    Node* pcur = list->head;
    while (pcur != NULL) {
        Node* temp = pcur;
        pcur = pcur->next;

        
        if (freeDataFunc != NULL) {
            freeDataFunc(temp->data);
        } else {
            free(temp->data);
        }

        free(temp);
    }
    free(list);
    list = NULL;
}
