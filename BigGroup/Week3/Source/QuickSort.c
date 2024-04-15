#include <stdio.h>
#include <stdlib.h>

void swap(int* a, int* b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

void quick_sort(int* arr, int len) {
    if (len <= 1) return;
    // 选基准
    int pivot = arr[rand() % len];
    // i：当前
    // arr[0, j)：< pivot
    // arr[k, len)：> pivot
    int i = 0, j = 0, k = len;
    while (i < k) {
        // j 负责前面，i负责走动，k负责后面
        if (arr[i] < pivot)
            swap(&arr[i++], &arr[j++]);
        else if (pivot < arr[i])
            swap(&arr[i], &arr[--k]);
        else
            i++;
    }
    quick_sort(arr, j);
    quick_sort(arr + k, len - k);
}

int main(){
    int a[5] = {1, 7, 3, 9, 4};
    printf("input:");
    for(int i = 0; i < 5; ++i) {
        printf("%d", a[i]);
    }
    printf("\noutput:");
    quick_sort(a, 5);
    for(int i = 0; i < 5; ++i) {
        printf("%d", a[i]);
    }
}