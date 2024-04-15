#include <stdio.h>

void insert_sort(int arr[], int len) {
    // 逐个放数字进有序区
    for (int a = 1; a < len; ++a) {
        int bak = arr[a];
        // 在 a 之前，比 arr[a] 大的都往后靠
        int b = a - 1;
        while (b >= 0 && arr[b] > bak) {
            arr[b+1] = arr[b];
            --b;
            // 边界（合法）条件：b 到达第0位
        }
        // 此时 b 指向比 bak 小的元素
        arr[b+1] = bak;
    }
}

int main() {
    int arr[6] = {2, 9, 4, 8, 7, 5};
    insert_sort(arr, 6);
    for (int i = 0; i < 6; ++i) {
        printf("%d", arr[i]);
    }
}