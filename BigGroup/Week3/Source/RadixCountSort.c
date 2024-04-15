#include <stdio.h>
#include <stdlib.h>
// LSD

// 从右往左算
int get_bit(int num, int bit) {
    int num_bak = num;
    int res = 0;
    while (bit && num_bak) {
        res = num_bak - num_bak/10*10;
        num_bak /= 10;
        --bit;
    }
    if (bit != 0) return 0;
    return res;
}

int get_max_bit(int* arr, int len) {
    int max = arr[0];
    for (int i = 0; i < len; ++i) {
        if (arr[i] > max) max = arr[i];
    }
    
    int res = 0;
    while (max) {
        ++res;
        max /= 10;
    }
    return res;
}

void radix_count_sort(int* arr, int len) {
    int* bucket[10];
    for (int i = 0; i < 10; ++i) {
        // 管够
        bucket[i] = (int*) malloc(sizeof(int) * len);
    }

    int max_bit = get_max_bit(arr, len);
    for (int b = 1; b <= max_bit; ++b) {
        // 个数计数器，存储每个bucket中存了多少元素
        int cnt[10] = {0};
        // 把每一位数放到对应的桶里
        for (int i = 0; i < len; ++i) {
            int bit = get_bit(arr[i], b);
            bucket[bit][cnt[bit]++] = arr[i];
        }

        // 拿出
        int tmp = len - 1;
        for (int j = 9; j >= 0; --j) {
            while (cnt[j]) {
                arr[tmp--] = bucket[j][cnt[j]-1];
                --cnt[j];
            }
        }
    }

}

int main() {
    int arr[5] = {124, 3425, 123,947,458};
    radix_count_sort(arr, 5);
    for (int i = 0; i < 5; ++i) {
        printf("%d ", arr[i]);
    }
}